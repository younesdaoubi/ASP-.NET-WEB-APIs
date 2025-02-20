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
    public class ConstellationsController : ControllerBase
    {
        private readonly IConstellationRepository _repository;
        private readonly IImageRepository _imageRepository;

        public ConstellationsController(IConstellationRepository repository, IImageRepository imageRepository)
        {
            _repository = repository;
            _imageRepository = imageRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConstellationDto>>> GetConstellations()
        {
            var constellations = await _repository.GetAllConstellationsAsync();
            var constellationDtos = constellations.Select(c => new ConstellationDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                MainStars = c.MainStars,
                BestViewingMonths = c.BestViewingMonths,
                XCoordinate = c.XCoordinate,
                YCoordinate = c.YCoordinate,
                ZCoordinate = c.ZCoordinate,
                ImageUrl = c.Image?.Path // Utilisation de l'opérateur de coalescence null
            }).ToList();

            return Ok(constellationDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConstellationDto>> GetConstellation(int id)
        {
            var constellation = await _repository.GetConstellationByIdAsync(id);
            if (constellation == null)
            {
                return NotFound();
            }

            var constellationDto = new ConstellationDto
            {
                Id = constellation.Id,
                Name = constellation.Name,
                Description = constellation.Description,
                MainStars = constellation.MainStars,
                BestViewingMonths = constellation.BestViewingMonths,
                XCoordinate = constellation.XCoordinate,
                YCoordinate = constellation.YCoordinate,
                ZCoordinate = constellation.ZCoordinate,
                ImageUrl = constellation.Image?.Path // URL d'image
            };

            return Ok(constellationDto);
        }

        [HttpPost]
        public async Task<ActionResult<ConstellationDto>> PostConstellation(ConstellationDto constellationDto)
        {
            //var defaultImage = await _imageRepository.GetByIdAsync(1); 
            var defaultImage = await _imageRepository.GetByNameAsync("constellation");
            if (defaultImage == null)
            {
                return BadRequest("Image par défaut non trouvée.");
            }

            var constellation = new Constellation
            {
                Name = constellationDto.Name,
                Description = constellationDto.Description,
                MainStars = constellationDto.MainStars,
                BestViewingMonths = constellationDto.BestViewingMonths,
                XCoordinate = constellationDto.XCoordinate,
                YCoordinate = constellationDto.YCoordinate,
                ZCoordinate = constellationDto.ZCoordinate,
                ImageId = defaultImage.Id,
                Image = defaultImage
            };

            await _repository.AddAsync(constellation);

            var createdConstellationDto = new ConstellationDto
            {
                Id = constellation.Id,
                Name = constellation.Name,
                Description = constellation.Description,
                MainStars = constellation.MainStars,
                BestViewingMonths = constellation.BestViewingMonths,
                XCoordinate = constellation.XCoordinate,
                YCoordinate = constellation.YCoordinate,
                ZCoordinate = constellation.ZCoordinate,
                ImageUrl = defaultImage.Path // URL d'image par défaut
            };

            return CreatedAtAction(nameof(GetConstellation), new { id = constellation.Id }, createdConstellationDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutConstellation(int id, ConstellationDto constellationDto)
        {
            if (id != constellationDto.Id)
            {
                return BadRequest(new { message = "L'ID dans l'URL ne correspond pas à l'ID dans le corps de la requête." });
            }

            var constellation = await _repository.GetConstellationByIdAsync(id);
            if (constellation == null)
            {
                return NotFound();
            }

            constellation.Name = constellationDto.Name;
            constellation.Description = constellationDto.Description;
            constellation.MainStars = constellationDto.MainStars;
            constellation.BestViewingMonths = constellationDto.BestViewingMonths;
            constellation.XCoordinate = constellationDto.XCoordinate;
            constellation.YCoordinate = constellationDto.YCoordinate;
            constellation.ZCoordinate = constellationDto.ZCoordinate;

            await _repository.UpdateAsync(constellation);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConstellation(int id)
        {
            var constellation = await _repository.GetByIdAsync(id);
            if (constellation == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }

        [HttpGet("by-month/{month}")]
        public async Task<ActionResult<IEnumerable<ConstellationDto>>> GetConstellationsByMonth(string month)
        {
            var constellations = await _repository.GetConstellationsByMonthAsync(month);
            var constellationDtos = constellations.Select(c => new ConstellationDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                MainStars = c.MainStars,
                BestViewingMonths = c.BestViewingMonths,
                XCoordinate = c.XCoordinate,
                YCoordinate = c.YCoordinate,
                ZCoordinate = c.ZCoordinate,
                ImageUrl = c.Image?.Path // URL d'image
            }).ToList();

            return Ok(constellationDtos);
        }

    }
}
