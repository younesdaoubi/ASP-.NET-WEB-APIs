namespace SpaceManagement.Models
{
    public class Planet : CelestialObject
    {
        public bool HasRings { get; set; }
        public bool SupportsLife { get; set; }
        public double Diameter { get; set; }
        public double Mass { get; set; }
        public double DistanceFromSun { get; set; }
        public string SurfaceTexture { get; set; }
        public ICollection<Moon> Moons { get; set; } = new List<Moon>();

    }
}
