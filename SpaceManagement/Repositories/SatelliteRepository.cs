using Microsoft.EntityFrameworkCore;
using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public class SatelliteRepository : GenericRepository<Satellite>, ISatelliteRepository
    {
        public SatelliteRepository(SpaceManagementContext context) : base(context) { }

        public async Task<IEnumerable<Satellite>> GetAllSatellitesAsync()
        {
            return await _context.Satellites.Include(s => s.Image).ToListAsync();
        }

        public async Task<Satellite> GetSatelliteWithImageByIdAsync(int id)
        {
            return await _context.Satellites
                .Include(s => s.Image) // inclu l'image lors de la récupération de l'alien par id
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}


 
