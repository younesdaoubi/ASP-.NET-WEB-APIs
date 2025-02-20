using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public interface IAlienRepository : IGenericRepository<Alien>
    {
        Task<IEnumerable<Alien>> GetAliensByOriginPlanetAsync(string originPlanet);
        Task<Alien> GetAlienWithImageByIdAsync(int id);
        Task<IEnumerable<Alien>> GetFriendlyAliensAsync();
    }
}
