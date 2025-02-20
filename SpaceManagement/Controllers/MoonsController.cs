using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpaceManagement.DTOs;
using SpaceManagement.Models;
using SpaceManagement.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MoonsController : ControllerBase
    {
        private readonly IMoonRepository _repository;
        private readonly IImageRepository _imageRepository;
        private readonly IPlanetRepository _planetRepository;

        // on injecte
        public MoonsController(IMoonRepository repository, IImageRepository imageRepository, IPlanetRepository planetRepository)
        {
            _repository = repository;
            _imageRepository = imageRepository;
            _planetRepository = planetRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MoonDto>>> GetMoons()
        {
            var moons = await _repository.GetAllMoonsAsync();
            var moonDtos = moons.Select(m => new MoonDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                ImageUrl = m.Image?.Path,
                XCoordinate = m.XCoordinate,
                YCoordinate = m.YCoordinate,
                ZCoordinate = m.ZCoordinate,
                PlanetId = m.PlanetId,
                OrbitalPeriod = m.OrbitalPeriod,
                DistanceFromPlanet = m.DistanceFromPlanet
            }).ToList();

            return Ok(moonDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MoonDto>> GetMoon(int id)
        {
            var moon = await _repository.GetMoonByIdAsync(id);
            if (moon == null)
            {
                return NotFound();
            }

            var moonDto = new MoonDto
            {
                Id = moon.Id,
                Name = moon.Name,
                Description = moon.Description,
                ImageUrl = moon.Image?.Path,
                XCoordinate = moon.XCoordinate,
                YCoordinate = moon.YCoordinate,
                ZCoordinate = moon.ZCoordinate,
                PlanetId = moon.PlanetId,
                OrbitalPeriod = moon.OrbitalPeriod,
                DistanceFromPlanet = moon.DistanceFromPlanet
            };

            return Ok(moonDto);
        }

        [HttpPost]
        public async Task<ActionResult<MoonDto>> PostMoon(MoonDto moonDto)
        {
            // Vérifier si la planète existe
            var planet = await _planetRepository.GetByIdAsync(moonDto.PlanetId);
            if (planet == null)
            {
                return BadRequest("Planète non trouvée.");
            }


            var image = await _imageRepository.GetByNameAsync("moon");
            if (image == null)
            {
                return BadRequest("Image par défaut non trouvée.");
            }

            var moon = new Moon
            {
                Name = moonDto.Name,
                Description = moonDto.Description,
                ImageId = image.Id, 
                XCoordinate = moonDto.XCoordinate,
                YCoordinate = moonDto.YCoordinate,
                ZCoordinate = moonDto.ZCoordinate,
                PlanetId = moonDto.PlanetId,
                OrbitalPeriod = moonDto.OrbitalPeriod,
                DistanceFromPlanet = moonDto.DistanceFromPlanet,
                Image = image
            };

            await _repository.AddAsync(moon);

            moonDto.Id = moon.Id;
            moonDto.ImageUrl = image.Path;

            return CreatedAtAction(nameof(GetMoon), new { id = moon.Id }, moonDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMoon(int id, MoonDto moonDto)
        {
            if (id != moonDto.Id)
            {
                return BadRequest(new { message = "L'ID dans l'URL ne correspond pas à l'ID dans le corps de la requête." });
            }

            var moon = await _repository.GetMoonByIdAsync(id);
            if (moon == null)
            {
                return NotFound();
            }

            // Vérifier si la planète existe
            var planet = await _planetRepository.GetByIdAsync(moonDto.PlanetId);
            if (planet == null)
            {
                return BadRequest("Planète non trouvée.");
            }


            var image = await _imageRepository.GetByNameAsync("moon");
            if (image == null)
            {
                return BadRequest("Image par défaut non trouvée.");
            }

            moon.Name = moonDto.Name;
            moon.Description = moonDto.Description;
            moon.XCoordinate = moonDto.XCoordinate;
            moon.YCoordinate = moonDto.YCoordinate;
            moon.ZCoordinate = moonDto.ZCoordinate;
            moon.PlanetId = moonDto.PlanetId;
            moon.OrbitalPeriod = moonDto.OrbitalPeriod;
            moon.DistanceFromPlanet = moonDto.DistanceFromPlanet;
            moon.Image = image;

            await _repository.UpdateAsync(moon);

            moonDto.ImageUrl = image.Path;

            return Ok(moonDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMoon(int id)
        {
            var moon = await _repository.GetByIdAsync(id);
            if (moon == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}
