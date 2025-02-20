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
    public class SatellitesController : ControllerBase
    {
        private readonly ISatelliteRepository _repository;
        private readonly IImageRepository _imageRepository;

        public SatellitesController(ISatelliteRepository repository, IImageRepository imageRepository)
        {
            _repository = repository;
            _imageRepository = imageRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SatelliteDto>>> GetSatellites()
        {
            var satellites = await _repository.GetAllSatellitesAsync();
            var satelliteDtos = satellites.Select(s => new SatelliteDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                ImageUrl = s.Image?.Path,  
                OrbitType = s.OrbitType,
                LaunchDate = s.LaunchDate,
                Function = s.Function,
                XCoordinate = s.XCoordinate,
                YCoordinate = s.YCoordinate,
                ZCoordinate = s.ZCoordinate
            }).ToList();

            return Ok(satelliteDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SatelliteDto>> GetSatellite(int id)
        {
            var satellite = await _repository.GetSatelliteWithImageByIdAsync(id);
            if (satellite == null)
            {
                return NotFound();
            }

            var satelliteDto = new SatelliteDto
            {
                Id = satellite.Id,
                Name = satellite.Name,
                Description = satellite.Description,
                ImageUrl = satellite.Image?.Path, // Utilisation de l'opérateur de coalescence null
                OrbitType = satellite.OrbitType,
                LaunchDate = satellite.LaunchDate,
                Function = satellite.Function,
                XCoordinate = satellite.XCoordinate,
                YCoordinate = satellite.YCoordinate,
                ZCoordinate = satellite.ZCoordinate
            };

            return Ok(satelliteDto);
        }

        [HttpPost]
        public async Task<ActionResult<SatelliteDto>> PostSatellite(SatelliteDto satelliteDto)
        {
            var defaultImage = await _imageRepository.GetByNameAsync("satellite");
            if (defaultImage == null)
            {
                return BadRequest("Image par défaut non trouvée.");
            }

            var satellite = new Satellite
            {
                Name = satelliteDto.Name,
                Description = satelliteDto.Description,
                ImageId = defaultImage.Id,
                OrbitType = satelliteDto.OrbitType,
                LaunchDate = satelliteDto.LaunchDate,
                Function = satelliteDto.Function,
                XCoordinate = satelliteDto.XCoordinate,
                YCoordinate = satelliteDto.YCoordinate,
                ZCoordinate = satelliteDto.ZCoordinate,
                Image = defaultImage
            };

            await _repository.AddAsync(satellite);

            var createdSatelliteDto = new SatelliteDto
            {
                Id = satellite.Id,
                Name = satellite.Name,
                Description = satellite.Description,
                ImageUrl = satellite.Image?.Path,
                OrbitType = satellite.OrbitType,
                LaunchDate = satellite.LaunchDate,
                Function = satellite.Function,
                XCoordinate = satellite.XCoordinate,
                YCoordinate = satellite.YCoordinate,
                ZCoordinate = satellite.ZCoordinate
            };

            return CreatedAtAction(nameof(GetSatellite), new { id = satellite.Id }, createdSatelliteDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSatellite(int id, SatelliteDto satelliteDto)
        {
            if (id != satelliteDto.Id)
            {
                return BadRequest();
            }

            var satellite = await _repository.GetByIdAsync(id);
            if (satellite == null)
            {
                return NotFound();
            }

            satellite.Name = satelliteDto.Name;
            satellite.Description = satelliteDto.Description;
            satellite.OrbitType = satelliteDto.OrbitType;
            satellite.LaunchDate = satelliteDto.LaunchDate;
            satellite.Function = satelliteDto.Function;
            satellite.XCoordinate = satelliteDto.XCoordinate;
            satellite.YCoordinate = satelliteDto.YCoordinate;
            satellite.ZCoordinate = satelliteDto.ZCoordinate;

            await _repository.UpdateAsync(satellite);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSatellite(int id)
        {
            var satellite = await _repository.GetByIdAsync(id);
            if (satellite == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}
