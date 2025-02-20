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
    public class PlanetsController : ControllerBase
    {
        private readonly IPlanetRepository _repository;
        private readonly IImageRepository _imageRepository;

        public PlanetsController(IPlanetRepository repository, IImageRepository imageRepository)
        {
            _repository = repository;
            _imageRepository = imageRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlanetDto>>> GetPlanets()
        {
            var planets = await _repository.GetAllWithMoonsAndImagesAsync();
            var planetDtos = planets.Select(p => new PlanetDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                XCoordinate = p.XCoordinate,
                YCoordinate = p.YCoordinate,
                ZCoordinate = p.ZCoordinate,
                HasRings = p.HasRings,
                SupportsLife = p.SupportsLife,
                Diameter = p.Diameter,
                Mass = p.Mass,
                DistanceFromSun = p.DistanceFromSun,
                SurfaceTexture = p.SurfaceTexture,  
                ImageUrl = p.Image?.Path,
                Moons = p.Moons.Select(m => new MoonDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    ImageUrl = m.Image?.Path,
                    XCoordinate = m.XCoordinate,
                    YCoordinate = m.YCoordinate,
                    ZCoordinate = m.ZCoordinate,
                    OrbitalPeriod = m.OrbitalPeriod,
                    DistanceFromPlanet = m.DistanceFromPlanet
                }).ToList()
            }).ToList();

            return Ok(planetDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlanetDto>> GetPlanet(int id)
        {
            var planet = await _repository.GetPlanetWithMoonsAndImageByIdAsync(id);
            if (planet == null)
            {
                return NotFound();
            }

            var planetDto = new PlanetDto
            {
                Id = planet.Id,
                Name = planet.Name,
                Description = planet.Description,
                XCoordinate = planet.XCoordinate,
                YCoordinate = planet.YCoordinate,
                ZCoordinate = planet.ZCoordinate,
                HasRings = planet.HasRings,
                SupportsLife = planet.SupportsLife,
                Diameter = planet.Diameter,
                Mass = planet.Mass,
                DistanceFromSun = planet.DistanceFromSun,
                SurfaceTexture = planet.SurfaceTexture, // Ajouté ici
                ImageUrl = planet.Image?.Path,
                Moons = planet.Moons.Select(m => new MoonDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    ImageUrl = m.Image?.Path,
                    XCoordinate = m.XCoordinate,
                    YCoordinate = m.YCoordinate,
                    ZCoordinate = m.ZCoordinate,
                    OrbitalPeriod = m.OrbitalPeriod,
                    DistanceFromPlanet = m.DistanceFromPlanet
                }).ToList()
            };

            return Ok(planetDto);
        }

        [HttpGet("withLife")]
        public async Task<ActionResult<IEnumerable<PlanetDto>>> GetPlanetsWithLife()
        {
            var planets = await _repository.GetPlanetsWithLifeAsync();
            var planetDtos = planets.Select(p => new PlanetDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                XCoordinate = p.XCoordinate,
                YCoordinate = p.YCoordinate,
                ZCoordinate = p.ZCoordinate,
                HasRings = p.HasRings,
                SupportsLife = p.SupportsLife,
                Diameter = p.Diameter,
                Mass = p.Mass,
                DistanceFromSun = p.DistanceFromSun,
                SurfaceTexture = p.SurfaceTexture, 
                ImageUrl = p.Image?.Path,
                Moons = p.Moons.Select(m => new MoonDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    ImageUrl = m.Image?.Path,
                    XCoordinate = m.XCoordinate,
                    YCoordinate = m.YCoordinate,
                    ZCoordinate = m.ZCoordinate,
                    OrbitalPeriod = m.OrbitalPeriod,
                    DistanceFromPlanet = m.DistanceFromPlanet
                }).ToList()
            }).ToList();

            return Ok(planetDtos);
        }

        [HttpGet("withRings")]
        public async Task<ActionResult<IEnumerable<PlanetDto>>> GetPlanetsWithRings()
        {
            var planets = await _repository.GetPlanetsWithRingsAsync();
            var planetDtos = planets.Select(p => new PlanetDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                XCoordinate = p.XCoordinate,
                YCoordinate = p.YCoordinate,
                ZCoordinate = p.ZCoordinate,
                HasRings = p.HasRings,
                SupportsLife = p.SupportsLife,
                Diameter = p.Diameter,
                Mass = p.Mass,
                DistanceFromSun = p.DistanceFromSun,
                SurfaceTexture = p.SurfaceTexture, // Ajouté ici
                ImageUrl = p.Image?.Path,
                Moons = p.Moons.Select(m => new MoonDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    ImageUrl = m.Image?.Path,
                    XCoordinate = m.XCoordinate,
                    YCoordinate = m.YCoordinate,
                    ZCoordinate = m.ZCoordinate,
                    OrbitalPeriod = m.OrbitalPeriod,
                    DistanceFromPlanet = m.DistanceFromPlanet
                }).ToList()
            }).ToList();

            return Ok(planetDtos);
        }
  

        [HttpPost]
        public async Task<ActionResult<PlanetDto>> PostPlanet(PlanetDto planetDto)
        {
            // Définir les textures valides et leurs correspondances avec les noms d'images
            var validTextures = new Dictionary<string, string>
                {
                    { "mars", "mars" },
                    { "terre", "earth" },
                    { "neptune", "neptune" },
                    { "jupiter", "jupiter" },
                    { "uranus", "uranus" },
                    { "venus", "venus" },
                    { "mercure", "mercury" }
                };

            // Vérification et application de la valeur par défaut pour SurfaceTexture
            var surfaceTexture = validTextures.ContainsKey(planetDto.SurfaceTexture.ToLower())
                                 ? planetDto.SurfaceTexture.ToLower()
                                 : "terre";

            // Récupération de l'image correspondant à la texture
            var textureImageName = validTextures[surfaceTexture];
            var image = await _imageRepository.GetByNameAsync(textureImageName);
            if (image == null)
            {
                return BadRequest($"Image pour la texture '{surfaceTexture}' non trouvée.");
            }

            var planet = new Planet
            {
                Name = planetDto.Name,
                Description = planetDto.Description,
                ImageId = image.Id,
                XCoordinate = planetDto.XCoordinate,
                YCoordinate = planetDto.YCoordinate,
                ZCoordinate = planetDto.ZCoordinate,
                HasRings = planetDto.HasRings,
                SupportsLife = planetDto.SupportsLife,
                Diameter = planetDto.Diameter,
                Mass = planetDto.Mass,
                DistanceFromSun = planetDto.DistanceFromSun,
                SurfaceTexture = surfaceTexture,
                Image = image
            };

            await _repository.AddAsync(planet);

            var createdPlanetDto = new PlanetDto
            {
                Id = planet.Id,
                Name = planet.Name,
                Description = planet.Description,
                XCoordinate = planet.XCoordinate,
                YCoordinate = planet.YCoordinate,
                ZCoordinate = planet.ZCoordinate,
                HasRings = planet.HasRings,
                SupportsLife = planet.SupportsLife,
                Diameter = planet.Diameter,
                Mass = planet.Mass,
                DistanceFromSun = planet.DistanceFromSun,
                SurfaceTexture = planet.SurfaceTexture,
                ImageUrl = planet.Image?.Path,
            };

            return CreatedAtAction(nameof(GetPlanet), new { id = planet.Id }, createdPlanetDto);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlanet(int id, PlanetDto planetDto)
        {
            if (id != planetDto.Id)
            {
                return BadRequest(new { message = "The ID in the URL does not match the ID in the request body." });
            }

            var planet = await _repository.GetPlanetWithMoonsAndImageByIdAsync(id);
            if (planet == null)
            {
                return NotFound();
            }

            // textures valides et leurs correspondances avec les noms d'images
            var validTextures = new Dictionary<string, string>
                {
                    { "mars", "mars" },
                    { "terre", "earth" },
                    { "neptune", "neptune" },
                    { "jupiter", "jupiter" },
                    { "uranus", "uranus" },
                    { "venus", "venus" },
                    { "mercure", "mercury" }
                };

            // Vérification et application de la valeur par défaut pour SurfaceTexture
            planetDto.SurfaceTexture = validTextures.ContainsKey(planetDto.SurfaceTexture.ToLower())
                                       ? planetDto.SurfaceTexture.ToLower()
                                       : "terre";

            // Récupération de l'image correspondant à la nouvelle texture
            var textureImageName = validTextures[planetDto.SurfaceTexture];
            var image = await _imageRepository.GetByNameAsync(textureImageName);
            if (image == null)
            {
                return BadRequest($"Image pour la texture '{planetDto.SurfaceTexture}' non trouvée.");
            }

            planet.Name = planetDto.Name;
            planet.Description = planetDto.Description;
            planet.XCoordinate = planetDto.XCoordinate;
            planet.YCoordinate = planetDto.YCoordinate;
            planet.ZCoordinate = planetDto.ZCoordinate;
            planet.HasRings = planetDto.HasRings;
            planet.SupportsLife = planetDto.SupportsLife;
            planet.Diameter = planetDto.Diameter;
            planet.Mass = planetDto.Mass;
            planet.DistanceFromSun = planetDto.DistanceFromSun;
            planet.SurfaceTexture = planetDto.SurfaceTexture;
            planet.ImageId = image.Id; // Mise à jour de l'image
            planet.Image = image;

            await _repository.UpdateAsync(planet);

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlanet(int id)
        {
            var planet = await _repository.GetByIdAsync(id);
            if (planet == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}
