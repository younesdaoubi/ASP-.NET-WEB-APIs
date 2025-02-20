using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly SpaceManagementContext _context;

        public ImageRepository(SpaceManagementContext context)
        {
            _context = context;
        }

        public async Task<Image> GetByIdAsync(int id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task<Image> GetByNameAsync(string name)
        {
            return await _context.Images
                .FirstOrDefaultAsync(img => img.Name == name);
        }
    }

    public interface IImageRepository
    {
        Task<Image> GetByIdAsync(int id);
        Task<Image> GetByNameAsync(string name);
    }
}
