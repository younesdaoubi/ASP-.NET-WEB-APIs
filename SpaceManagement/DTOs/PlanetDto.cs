namespace SpaceManagement.DTOs
{
    public class PlanetDto : CelestialObjectDto
    {
        public bool HasRings { get; set; }
        public bool SupportsLife { get; set; }
        public double Diameter { get; set; }  
        public double Mass { get; set; } 
        public double DistanceFromSun { get; set; }
        public string SurfaceTexture { get; set; }
        public ICollection<MoonDto> Moons { get; set; } = new List<MoonDto>();

    }
}
