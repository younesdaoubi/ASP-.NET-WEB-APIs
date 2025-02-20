using Microsoft.EntityFrameworkCore;
using SpaceManagementAuthentication.Models;

namespace SpaceManagementAuthentication.Data
{
    public class AuthenticationContext : DbContext
    {
        public AuthenticationContext(DbContextOptions<AuthenticationContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<UserNotification> UserNotifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }



    }
}
