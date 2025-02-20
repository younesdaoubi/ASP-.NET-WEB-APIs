using SpaceManagementAuthentication.Data;
using SpaceManagementAuthentication.Models;

namespace SpaceManagementAuthentication.Services
{
    public class UserService : IUserService
    {
        private readonly AuthenticationContext _context;

        public UserService(AuthenticationContext context)
        {
            _context = context;
        }

        public User Authenticate(string username, string password)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }

            return user;
        }

        public User Register(string username, string password)
        {
            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }
    }
}
