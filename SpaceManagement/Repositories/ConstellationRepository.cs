using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;

namespace SpaceManagement.Repositories
{
    public class ConstellationRepository : GenericRepository<Constellation>, IConstellationRepository
    {
        public ConstellationRepository(SpaceManagementContext context) : base(context) { }

        public async Task<IEnumerable<Constellation>> GetAllConstellationsAsync()
        {
            return await _context.Constellations
                .Include(c => c.Image) // Inclure les images
                .ToListAsync();
        }
 

        public async Task<Constellation> GetConstellationByIdAsync(int id)
        {
            return await _context.Constellations
               .Include(c => c.Image) // Inclure les images
               .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Constellation>> GetConstellationsByMonthAsync(string month)
        {
             
            return await _context.Constellations
                .Where(c => c.BestViewingMonths.Contains(month))
                .Include(c => c.Image)
                .ToListAsync();
        }

        public Task<IEnumerable<Constellation>> GetConstellationsByMonthAsync()
        {
            throw new NotImplementedException();
        }
    }
}
