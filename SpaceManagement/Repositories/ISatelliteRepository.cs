using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public interface ISatelliteRepository : IGenericRepository<Satellite>
    {
        Task<IEnumerable<Satellite>> GetAllSatellitesAsync();
        Task<Satellite> GetSatelliteWithImageByIdAsync(int id);
    }
}
