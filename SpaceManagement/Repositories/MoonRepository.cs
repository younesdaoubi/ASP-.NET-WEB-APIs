using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public class MoonRepository : GenericRepository<Moon>, IMoonRepository
    {
        public MoonRepository(SpaceManagementContext context) : base(context) { }

        public async Task<IEnumerable<Moon>> GetAllMoonsAsync()
        {
            return await _context.Moons.Include(m => m.Image).Include(m => m.Planet).ToListAsync();
        }

        public async Task<Moon> GetMoonByIdAsync(int id)
        {
            return await _context.Moons.Include(m => m.Image).Include(m => m.Planet).FirstOrDefaultAsync(m => m.Id == id);
        }
    }
}
