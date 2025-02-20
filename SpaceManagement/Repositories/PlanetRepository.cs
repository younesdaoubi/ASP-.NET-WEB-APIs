using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public class PlanetRepository : GenericRepository<Planet>, IPlanetRepository
    {

        public PlanetRepository(SpaceManagementContext context) : base(context) { }

        public async Task<IEnumerable<Planet>> GetAllWithMoonsAndImagesAsync()
        {
            return await _context.Planets
                .Include(p => p.Moons)
                .Include(p => p.Image)
                .ToListAsync();
        }

        public async Task<Planet> GetPlanetWithMoonsAndImageByIdAsync(int id)
        {
            return await _context.Planets
                .Include(p => p.Moons)
                .Include(p => p.Image)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Planet>> GetPlanetsWithLifeAsync()
        {
            return await _context.Planets
                .Include(p => p.Moons)
                .Include(p => p.Image)
                .Where(p => p.SupportsLife)
                .ToListAsync();
        }

        public async Task<IEnumerable<Planet>> GetPlanetsWithRingsAsync()
        {
            return await _context.Planets
                .Include(p => p.Moons)
                .Include(p => p.Image)
                .Where(p => p.HasRings)
                .ToListAsync();
        }
    }
}
