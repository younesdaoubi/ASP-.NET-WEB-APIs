namespace SpaceManagement.Models
{
    public class Moon : CelestialObject
    {
        public int PlanetId { get; set; }
        public Planet Planet { get; set; }
        public double OrbitalPeriod { get; set; }
        public double DistanceFromPlanet { get; set; }
    }
}
