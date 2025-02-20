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
    public class CometsController : ControllerBase
    {
        private readonly ICometRepository _repository;
        private readonly IImageRepository _imageRepository;

        public CometsController(ICometRepository repository, IImageRepository imageRepository)
        {
            _repository = repository;
            _imageRepository = imageRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CometDto>>> GetComets()
        {
            var comets = await _repository.GetAllCometsAsync();
            var cometDtos = comets.Select(c => new CometDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description, 
                ImageUrl = c.Image?.Path,
                XCoordinate = c.XCoordinate,
                YCoordinate = c.YCoordinate,
                ZCoordinate = c.ZCoordinate,
                NextAppearance = c.NextAppearance,
                TailColor = c.TailColor
            }).ToList();

            return Ok(cometDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CometDto>> GetComet(int id)
        {
            var comet = await _repository.GetCometWithImageByIdAsync(id);
            if (comet == null)
            {
                return NotFound();
            }

            var cometDto = new CometDto
            {
                Id = comet.Id,
                Name = comet.Name,
                Description = comet.Description,
                ImageUrl = comet.Image?.Path,
                XCoordinate = comet.XCoordinate,
                YCoordinate = comet.YCoordinate,
                ZCoordinate = comet.ZCoordinate,
                NextAppearance = comet.NextAppearance,
                TailColor = comet.TailColor
            };

            return Ok(cometDto);
        }

        [HttpPost]
        public async Task<ActionResult<CometDto>> PostComet(CometDto cometDto)
        {
            string imageName = cometDto.TailColor.ToLower() == "blue" ? "cometBlue" : "cometOrange";
            var image = await _imageRepository.GetByNameAsync(imageName);
            if (image == null)
            {
                return BadRequest("Image non trouvée.");
            }

            var comet = new Comet
            {
                Name = cometDto.Name,
                Description = cometDto.Description,
                ImageId = image.Id,
                XCoordinate = cometDto.XCoordinate,
                YCoordinate = cometDto.YCoordinate,
                ZCoordinate = cometDto.ZCoordinate,
                NextAppearance = cometDto.NextAppearance,
                TailColor = cometDto.TailColor,
                Image = image
            };

            await _repository.AddAsync(comet);

            cometDto.Id = comet.Id;
            cometDto.ImageUrl = image.Path;

            return CreatedAtAction(nameof(GetComet), new { id = comet.Id }, cometDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutComet(int id, CometDto cometDto)
        {
            if (id != cometDto.Id)
            {
                return BadRequest(new { message = "The ID in the URL does not match the ID in the request body." });
            }

            var comet = await _repository.GetCometWithImageByIdAsync(id);
            if (comet == null)
            {
                return NotFound();
            }

            string imageName = cometDto.TailColor.ToLower() == "blue" ? "cometBlue" : "cometOrange";
            var image = await _imageRepository.GetByNameAsync(imageName);
            if (image == null)
            {
                return BadRequest("Image non trouvée.");
            }

            comet.Name = cometDto.Name;
            comet.Description = cometDto.Description;
            comet.XCoordinate = cometDto.XCoordinate;
            comet.YCoordinate = cometDto.YCoordinate;
            comet.ZCoordinate = cometDto.ZCoordinate;
            comet.NextAppearance = cometDto.NextAppearance;
            comet.TailColor = cometDto.TailColor;
            comet.Image = image;

            await _repository.UpdateAsync(comet);

            cometDto.ImageUrl = image.Path;

            return Ok(cometDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComet(int id)
        {
            var comet = await _repository.GetByIdAsync(id);
            if (comet == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}
