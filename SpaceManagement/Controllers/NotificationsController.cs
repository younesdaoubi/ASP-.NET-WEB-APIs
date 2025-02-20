using Microsoft.AspNetCore.Mvc;
using SpaceManagement.DTOs;
using SpaceManagement.Models;
using SpaceManagement.Repositories;
using System.Threading.Tasks;

namespace SpaceManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationsController(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationDto notificationDto)
        {
            var notification = new Notification
            {
                AlienId = notificationDto.AlienId,
                Message = notificationDto.Message,
                NotificationDate = notificationDto.NotificationDate,
                Location = notificationDto.Location
            };

            await _notificationRepository.AddNotificationAsync(notification);

            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NotificationDto>> GetNotification(int id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null)
            {
                return NotFound();
            }

            var notificationDto = new NotificationDto
            {
                AlienId = notification.AlienId,
                Message = notification.Message,
                NotificationDate = notification.NotificationDate,
                Location = notification.Location
            };

            return Ok(notificationDto);
        }

        [HttpGet("by-alien/{alienId}")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotificationsForAlien(int alienId)
        {
            var notifications = await _notificationRepository.GetNotificationsForAlienAsync(alienId);
            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                AlienId = n.AlienId,
                Message = n.Message,
                NotificationDate = n.NotificationDate,
                Location = n.Location
            }).ToList();

            return Ok(notificationDtos);
        }
    }
}
