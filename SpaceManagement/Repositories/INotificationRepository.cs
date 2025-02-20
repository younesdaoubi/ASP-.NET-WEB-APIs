using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetNotificationsForAlienAsync(int alienId);
        Task AddNotificationAsync(Notification notification);
        Task<Notification> GetByIdAsync(int id);
    }

    public class NotificationRepository : INotificationRepository
    {
        private readonly SpaceManagementContext _context;

        public NotificationRepository(SpaceManagementContext context)
        {
            _context = context;
        }

        public async Task AddNotificationAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task<Notification> GetByIdAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.Alien)
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<IEnumerable<Notification>> GetNotificationsForAlienAsync(int alienId)
        {
            return await _context.Notifications
                .Include(n => n.Alien)
                .Where(n => n.AlienId == alienId)
                .ToListAsync();
        }
    }
}
