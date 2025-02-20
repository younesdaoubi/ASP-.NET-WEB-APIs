using Microsoft.AspNetCore.Mvc;
using SpaceManagementAuthentication.Data;
using SpaceManagementAuthentication.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpaceManagementAuthentication.DTOs;

namespace SpaceManagementAuthentication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserNotificationsController : ControllerBase
    {
        private readonly AuthenticationContext _context;

        public UserNotificationsController(AuthenticationContext context)
        {
            _context = context;
        }

        [HttpPost("add-notification")]
        public async Task<IActionResult> AddNotificationToAllUsers([FromBody] NotificationDto notificationDto)
        {
            var users = await _context.Users.ToListAsync();

            foreach (var user in users)
            {
                // Ajoute la notification à chaque utilisateur.
                user.Notifications.Add(new UserNotification
                {
                    Message = notificationDto.Message,
                    NotificationDate = notificationDto.NotificationDate,
                    Location = notificationDto.Location,
                    AlienId = notificationDto.AlienId
                });
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("notifications/{userId}")]
        public async Task<IActionResult> GetNotificationsByUserId(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Notifications)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            var notifications = user.Notifications
                .OrderBy(n => n.Id)
                .Select(n => new NotificationDto
                {
                    AlienId = n.AlienId,
                    Message = n.Message,
                    NotificationDate = n.NotificationDate,
                    Location = n.Location
                })
                .ToList();

            return Ok(notifications);
        }


        [HttpDelete("notifications/{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var user = await _context.Users
                .Include(u => u.Notifications)
                .SingleOrDefaultAsync(u => u.Notifications.Any(n => n.Id == id));

            if (user == null)
            {
                return NotFound($"Notification with ID {id} not found.");
            }

            var notification = user.Notifications.SingleOrDefault(n => n.Id == id);
            if (notification != null)
            {
                user.Notifications.Remove(notification);
                await _context.SaveChangesAsync();
                return NoContent();  
            }

            return NotFound($"Notification with ID {id} not found.");
        }

    }
}
