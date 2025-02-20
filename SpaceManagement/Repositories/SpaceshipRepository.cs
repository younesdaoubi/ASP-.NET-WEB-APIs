using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public class SpaceshipRepository : GenericRepository<Spaceship>, ISpaceshipRepository
    {
        public SpaceshipRepository(SpaceManagementContext context) : base(context) { }

        public async Task<IEnumerable<Spaceship>> GetAllAsync()
        {
            return await _context.Spaceships.Include(s => s.Image).ToListAsync();
        }

        public async Task<Spaceship> GetSpaceshipWithImageByIdAsync(int id)
        {
            return await _context.Spaceships
                .Include(s => s.Image)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}
