using SpaceManagement.Models;

namespace SpaceManagement.Repositories
{
    public interface IConstellationRepository : IGenericRepository<Constellation>
    {
        Task<IEnumerable<Constellation>> GetAllConstellationsAsync();
        Task<IEnumerable<Constellation>> GetConstellationsByMonthAsync(string month);
        Task<Constellation> GetConstellationByIdAsync(int id);
        
    }
}
