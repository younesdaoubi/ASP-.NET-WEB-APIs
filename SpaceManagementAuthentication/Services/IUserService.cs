using SpaceManagementAuthentication.Models;

namespace SpaceManagementAuthentication.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        User Register(string username, string password);
    }
}

