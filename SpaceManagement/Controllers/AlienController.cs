using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceManagement.DTOs;
using SpaceManagement.Models;
using SpaceManagement.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;

namespace SpaceManagement.Controllers
{
     //[Authorize] signifie que seules les requêtes authentifiées sont autorisées.
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AliensController : ControllerBase
    {
        // Dépendances injectées via le constructeur.
        private readonly IAlienRepository _repository;
        private readonly IImageRepository _imageRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly HttpClient _httpClient;

        // Constructeur du contrôleur qui reçoit les dépendances via l'injection de dépendances.
        public AliensController(IAlienRepository repository, IImageRepository imageRepository, INotificationRepository notificationRepository, HttpClient httpClient)
        {
            _repository = repository;
            _imageRepository = imageRepository;
            _notificationRepository = notificationRepository;
            _httpClient = httpClient;
        }

        // Action HTTP GET pour récupérer la liste de tous les Aliens.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AlienDto>>> GetAliens()
        {
            // Récupération de tous les aliens depuis le dépôt.
            var aliens = await _repository.GetAllAsync();
            var alienDtos = aliens.Select(a => new AlienDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description,
                XCoordinate = a.XCoordinate,
                YCoordinate = a.YCoordinate,
                ZCoordinate = a.ZCoordinate,
                OriginPlanet = a.OriginPlanet,
                IsFriendly = a.IsFriendly,
                ImageUrl = a.Image?.Path
            }).ToList();

            return Ok(alienDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AlienDto>> GetAlien(int id)
        {
            var alien = await _repository.GetAlienWithImageByIdAsync(id);
            if (alien == null)
            {
                return NotFound();
            }

            var alienDto = new AlienDto
            {
                Id = alien.Id,
                Name = alien.Name,
                Description = alien.Description,
                XCoordinate = alien.XCoordinate,
                YCoordinate = alien.YCoordinate,
                ZCoordinate = alien.ZCoordinate,
                OriginPlanet = alien.OriginPlanet,
                IsFriendly = alien.IsFriendly,
                ImageUrl = alien.Image?.Path
            };

            return Ok(alienDto);
        }

        [HttpPost]
        public async Task<ActionResult<AlienDto>> PostAlien(AlienDto alienDto)
        {
            var defaultImage = await _imageRepository.GetByNameAsync("alien");
            if (defaultImage == null)
            {
                return BadRequest("Image par défaut non trouvée.");
            }

            var alien = new Alien
            {
                Name = alienDto.Name,
                Description = alienDto.Description,
                ImageId = defaultImage.Id,
                XCoordinate = alienDto.XCoordinate,
                YCoordinate = alienDto.YCoordinate,
                ZCoordinate = alienDto.ZCoordinate,
                OriginPlanet = alienDto.OriginPlanet,
                IsFriendly = alienDto.IsFriendly,
                Image = defaultImage
            };

            await _repository.AddAsync(alien);

            // Obtention du nom de l'utilisateur connecté
            var userName = User.Identity.Name;  

            var notificationMessage = $"Un nouvel Alien encore jamais aperçu auparavant a été ajouté à la carte par {userName}, aux positions : X: {alien.XCoordinate}, Y: {alien.YCoordinate}, Z: {alien.ZCoordinate} à {DateTime.UtcNow:HH:mm:ss} UTC.";

            var notification = new Notification
            {
                AlienId = alien.Id,
                Message = notificationMessage,
                NotificationDate = DateTime.UtcNow,
                Location = "Inconnu"  
            };

            await _notificationRepository.AddNotificationAsync(notification);

            var notificationDto = new NotificationDto
            {
                AlienId = notification.AlienId,
                Message = notification.Message,
                NotificationDate = notification.NotificationDate,
                Location = notification.Location
            };

            var content = new StringContent(JsonSerializer.Serialize(notificationDto), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://localhost:7134/api/UserNotifications/add-notification", content); // communication http api auth

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Erreur lors de l'ajout de la notification pour les utilisateurs.");
            }

            var createdAlienDto = new AlienDto
            {
                Id = alien.Id,
                Name = alien.Name,
                Description = alien.Description,
                XCoordinate = alien.XCoordinate,
                YCoordinate = alien.YCoordinate,
                ZCoordinate = alien.ZCoordinate,
                OriginPlanet = alien.OriginPlanet,
                IsFriendly = alien.IsFriendly,
                ImageUrl = alien.Image?.Path
            };

            return CreatedAtAction(nameof(GetAlien), new { id = alien.Id }, createdAlienDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlien(int id, AlienDto alienDto)
        {
            if (id != alienDto.Id)
            {
                return BadRequest(new { message = "The ID in the URL does not match the ID in the request body." });
            }

            var alien = await _repository.GetAlienWithImageByIdAsync(id);
            if (alien == null)
            {
                return NotFound();
            }

            // Sauvegarde des coordonnées avant modification
            var oldX = alien.XCoordinate;
            var oldY = alien.YCoordinate;
            var oldZ = alien.ZCoordinate;

            alien.Name = alienDto.Name;
            alien.Description = alienDto.Description;
            alien.XCoordinate = alienDto.XCoordinate;
            alien.YCoordinate = alienDto.YCoordinate;
            alien.ZCoordinate = alienDto.ZCoordinate;
            alien.OriginPlanet = alienDto.OriginPlanet;
            alien.IsFriendly = alienDto.IsFriendly;

            await _repository.UpdateAsync(alien);

            var notificationMessage = $"Les informations de l'alien nommé \"{alien.Name}\"ont étés modifiées. Alien actuellement aperçu aux positions : X: {alien.XCoordinate}, Y: {alien.YCoordinate}, Z: {alien.ZCoordinate} à {DateTime.UtcNow:HH:mm:ss} UTC. Ses informations ont été mises à jour.";

            var notification = new Notification
            {
                AlienId = alien.Id,
                Message = notificationMessage,
                NotificationDate = DateTime.UtcNow,
                Location = "Inconnu"  
            };

            await _notificationRepository.AddNotificationAsync(notification);

            var notificationDto = new NotificationDto
            {
                AlienId = notification.AlienId,
                Message = notification.Message,
                NotificationDate = notification.NotificationDate,
                Location = notification.Location
            };

            var content = new StringContent(JsonSerializer.Serialize(notificationDto), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://localhost:7134/api/UserNotifications/add-notification", content);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Erreur lors de l'ajout de la notification pour les utilisateurs.");
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlien(int id)
        {
            var alien = await _repository.GetByIdAsync(id);
            if (alien == null)
            {
                return NotFound();
            }

            var notificationMessage = $"L'alien nommé \"{alien.Name}\" a disparu du champ de vision, et a été radié de la carte.";

            var notification = new Notification
            {
                AlienId = alien.Id,
                Message = notificationMessage,
                NotificationDate = DateTime.UtcNow,
                Location = "Inconnu"  
            };

            await _notificationRepository.AddNotificationAsync(notification);

            var notificationDto = new NotificationDto
            {
                AlienId = notification.AlienId,
                Message = notification.Message,
                NotificationDate = notification.NotificationDate,
                Location = notification.Location
            };

            var content = new StringContent(JsonSerializer.Serialize(notificationDto), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://localhost:7134/api/UserNotifications/add-notification", content); //communication http avec l'autre api auth.

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Erreur lors de l'ajout de la notification pour les utilisateurs.");
            }

            await _repository.DeleteAsync(id);

            return NoContent(); //204
        }


        [HttpGet("by-origin-planet/{originPlanet}")]
        public async Task<ActionResult<IEnumerable<AlienDto>>> GetAliensByOriginPlanet(string originPlanet)
        {
            var aliens = await _repository.GetAliensByOriginPlanetAsync(originPlanet);
            var alienDtos = aliens.Select(a => new AlienDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description,
                XCoordinate = a.XCoordinate,
                YCoordinate = a.YCoordinate,
                ZCoordinate = a.ZCoordinate,
                OriginPlanet = a.OriginPlanet,
                IsFriendly = a.IsFriendly,
                ImageUrl = a.Image?.Path
            }).ToList();

            return Ok(alienDtos);
        }

        [HttpGet("friendly")]
        public async Task<ActionResult<IEnumerable<AlienDto>>> GetFriendlyAliens()
        {
            var aliens = await _repository.GetFriendlyAliensAsync();
            var alienDtos = aliens.Select(a => new AlienDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description,
                XCoordinate = a.XCoordinate,
                YCoordinate = a.YCoordinate,
                ZCoordinate = a.ZCoordinate,
                OriginPlanet = a.OriginPlanet,
                IsFriendly = a.IsFriendly,
                ImageUrl = a.Image?.Path
            }).ToList();

            return Ok(alienDtos);
        }
    }
}
