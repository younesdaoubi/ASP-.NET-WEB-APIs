using SpaceManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceManagement.Repositories
{
    public interface IMoonRepository : IGenericRepository<Moon>
    {
        Task<IEnumerable<Moon>> GetAllMoonsAsync();
        Task<Moon> GetMoonByIdAsync(int id);
    }
}
