using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SpaceManagement.Models
{
    public class SpaceManagementContext : DbContext
    {
        public SpaceManagementContext(DbContextOptions<SpaceManagementContext> options) : base(options)
        {
        }
        // Ces propriétés représentent les tables de la base de données pour chaque entité.
        public DbSet<CelestialObject> CelestialObjects { get; set; }
        public DbSet<Planet> Planets { get; set; }
        public DbSet<Moon> Moons { get; set; }
        public DbSet<Satellite> Satellites { get; set; }
        public DbSet<Constellation> Constellations { get; set; }
        public DbSet<Comet> Comets { get; set; }
        public DbSet<Spaceship> Spaceships { get; set; }
        public DbSet<Alien> Aliens { get; set; }
        public DbSet<Image> Images { get; set; }
 
        public DbSet<Notification> Notifications { get; set; }  


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuration pour l'héritage (table partagée) avec un discriminateur pour différencier les types d'objets célestes.
            modelBuilder.Entity<CelestialObject>()
                .HasDiscriminator<string>("CelestialObjectType")
                .HasValue<Planet>("Planet")
                .HasValue<Moon>("Moon")
                .HasValue<Satellite>("Satellite")
                .HasValue<Constellation>("Constellation")
                .HasValue<Comet>("Comet")
                .HasValue<Spaceship>("Spaceship")
                .HasValue<Alien>("Alien");

            // Définition de la relation entre une planète et ses lunes.
            modelBuilder.Entity<Planet>()
               .HasMany(p => p.Moons) // Une planète peut avoir plusieurs lunes.
               .WithOne(m => m.Planet) // Une lune est liée à une planète.
               .HasForeignKey(m => m.PlanetId) // Clé étrangère pour la lune.
               .OnDelete(DeleteBehavior.Cascade); // Suppression en cascade, les lunes sont supprimées si la planète est supprimée.

            // Relation inverse : une lune est liée à une planète, mais avec suppression restreinte.
            modelBuilder.Entity<Moon>()
                .HasOne(m => m.Planet)
                .WithMany(p => p.Moons)
                .HasForeignKey(m => m.PlanetId)
                .OnDelete(DeleteBehavior.Restrict); // Suppression restreinte, la planète ne peut pas être supprimée si elle a des lunes.

            // Configuration pour les notifications liées aux aliens.
            modelBuilder.Entity<Notification>()
              .HasOne(n => n.Alien) // Une notification est liée à un alien.
              .WithMany() // Aucun besoin de collection pour les notifications dans l'alien.
              .HasForeignKey(n => n.AlienId) // Clé étrangère pour l'alien.
              .OnDelete(DeleteBehavior.Cascade); // Suppression en cascade, la notification est supprimée si l'alien est supprimé.



            modelBuilder.Entity<Comet>()
                .Property(c => c.NextAppearance)
                .IsRequired();

             modelBuilder.Entity<Alien>()
                .Property(a => a.OriginPlanet)
                .IsRequired();
        }
    }
}