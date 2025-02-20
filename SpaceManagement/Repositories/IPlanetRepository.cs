using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public interface IPlanetRepository : IGenericRepository<Planet>
    {
        Task<IEnumerable<Planet>> GetAllWithMoonsAndImagesAsync();
        Task<Planet> GetPlanetWithMoonsAndImageByIdAsync(int id);
        Task<IEnumerable<Planet>> GetPlanetsWithLifeAsync();
        Task<IEnumerable<Planet>> GetPlanetsWithRingsAsync();
    }
}
