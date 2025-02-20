using SpaceManagement.Models;

namespace SpaceManagement.Repositories
{
    public interface ICometRepository : IGenericRepository<Comet>
    {
        Task<IEnumerable<Comet>> GetAllCometsAsync();
        Task<Comet> GetCometWithImageByIdAsync(int id); 

    }
}

