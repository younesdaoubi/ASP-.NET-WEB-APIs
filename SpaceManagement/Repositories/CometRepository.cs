using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public class CometRepository : GenericRepository<Comet>, ICometRepository
    {
        public CometRepository(SpaceManagementContext context) : base(context) { }

        public async Task<IEnumerable<Comet>> GetAllCometsAsync()
        {
            return await _context.Comets.Include(s => s.Image).ToListAsync();
        }

        public async Task<Comet> GetCometWithImageByIdAsync(int id)
        {
            return await _context.Comets.Include(c => c.Image).FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
