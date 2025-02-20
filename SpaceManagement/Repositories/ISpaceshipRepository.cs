using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public interface ISpaceshipRepository : IGenericRepository<Spaceship>
    {
        Task<IEnumerable<Spaceship>> GetAllAsync();
        Task<Spaceship> GetSpaceshipWithImageByIdAsync(int id);
    }
}
