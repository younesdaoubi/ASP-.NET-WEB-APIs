namespace SpaceManagement.DTOs
{
    public class MoonDto : CelestialObjectDto
    {
        public int PlanetId { get; set; }
        public double OrbitalPeriod { get; set; } 
        public double DistanceFromPlanet { get; set; }
    }
}
