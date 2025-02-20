using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public class AlienRepository : GenericRepository<Alien>, IAlienRepository
    {
        public AlienRepository(SpaceManagementContext context) : base(context) { }

        public async Task<IEnumerable<Alien>> GetAliensByOriginPlanetAsync(string originPlanet)
        {
            return await _context.Aliens
                .Include(a => a.Image)
                .Where(a => a.OriginPlanet == originPlanet)
                .ToListAsync();
        }

        public async Task<IEnumerable<Alien>> GetFriendlyAliensAsync()
        {
            return await _context.Aliens
                .Include(a => a.Image)
                .Where(a => a.IsFriendly)
                .ToListAsync();
        }

        public async Task<IEnumerable<Alien>> GetAllAsync()
        {
            return await _context.Aliens.Include(a => a.Image).ToListAsync();
        }

        public async Task<Alien> GetAlienWithImageByIdAsync(int id)
        {
            return await _context.Aliens
                .Include(a => a.Image) // inclu l'image lors de la récupération de l'alien par id
                .FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}
