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
    public class SpaceshipsController : ControllerBase
    {
        private readonly ISpaceshipRepository _repository;
        private readonly IImageRepository _imageRepository;

        public SpaceshipsController(ISpaceshipRepository repository, IImageRepository imageRepository)
        {
            _repository = repository;
            _imageRepository = imageRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpaceshipDto>>> GetSpaceships()
        {
            var spaceships = await _repository.GetAllAsync();
            var spaceshipDtos = spaceships.Select(s => new SpaceshipDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                ImageUrl = s.Image?.Path,
                Mission = s.Mission,
                LaunchDate = s.LaunchDate,
                ReturnDate = s.ReturnDate,
                XCoordinate = s.XCoordinate,
                YCoordinate = s.YCoordinate,
                ZCoordinate = s.ZCoordinate
            }).ToList();

            return Ok(spaceshipDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SpaceshipDto>> GetSpaceship(int id)
        {
            var spaceship = await _repository.GetSpaceshipWithImageByIdAsync(id);
            if (spaceship == null)
            {
                return NotFound();
            }

            var spaceshipDto = new SpaceshipDto
            {
                Id = spaceship.Id,
                Name = spaceship.Name,
                Description = spaceship.Description,
                ImageUrl = spaceship.Image?.Path,
                Mission = spaceship.Mission,
                LaunchDate = spaceship.LaunchDate,
                ReturnDate = spaceship.ReturnDate,
                XCoordinate = spaceship.XCoordinate,
                YCoordinate = spaceship.YCoordinate,
                ZCoordinate = spaceship.ZCoordinate
            };

            return Ok(spaceshipDto);
        }

        [HttpPost]
        public async Task<ActionResult<SpaceshipDto>> PostSpaceship(SpaceshipDto spaceshipDto)
        {
            var defaultImage = await _imageRepository.GetByNameAsync("spaceship");
            if (defaultImage == null)
            {
                return BadRequest("Image par défaut non trouvée.");
            }

            var spaceship = new Spaceship
            {
                Name = spaceshipDto.Name,
                Description = spaceshipDto.Description,
                ImageId = defaultImage.Id,
                Mission = spaceshipDto.Mission,
                LaunchDate = spaceshipDto.LaunchDate,
                ReturnDate = spaceshipDto.ReturnDate,
                Image = defaultImage,
                XCoordinate = spaceshipDto.XCoordinate,
                YCoordinate = spaceshipDto.YCoordinate,
                ZCoordinate = spaceshipDto.ZCoordinate
            };

            await _repository.AddAsync(spaceship);

            var createdSpaceshipDto = new SpaceshipDto
            {
                Id = spaceship.Id,
                Name = spaceship.Name,
                Description = spaceship.Description,
                ImageUrl = spaceship.Image?.Path,
                Mission = spaceship.Mission,
                LaunchDate = spaceship.LaunchDate,
                ReturnDate = spaceship.ReturnDate,
                XCoordinate = spaceship.XCoordinate,
                YCoordinate = spaceship.YCoordinate,
                ZCoordinate = spaceship.ZCoordinate
            };

            return CreatedAtAction(nameof(GetSpaceship), new { id = spaceship.Id }, createdSpaceshipDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpaceship(int id, SpaceshipDto spaceshipDto)
        {
            if (id != spaceshipDto.Id)
            {
                return BadRequest(new { message = "The ID in the URL does not match the ID in the request body." });
            }

            var spaceship = await _repository.GetSpaceshipWithImageByIdAsync(id);
            if (spaceship == null)
            {
                return NotFound();
            }

            spaceship.Name = spaceshipDto.Name;

            spaceship.Description = spaceshipDto.Description;
            spaceship.Mission = spaceshipDto.Mission;
            spaceship.LaunchDate = spaceshipDto.LaunchDate;
            spaceship.ReturnDate = spaceshipDto.ReturnDate;
            spaceship.XCoordinate = spaceshipDto.XCoordinate;
            spaceship.YCoordinate = spaceshipDto.YCoordinate;
            spaceship.ZCoordinate = spaceshipDto.ZCoordinate;

            await _repository.UpdateAsync(spaceship);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpaceship(int id)
        {
            var spaceship = await _repository.GetByIdAsync(id);
            if (spaceship == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}
