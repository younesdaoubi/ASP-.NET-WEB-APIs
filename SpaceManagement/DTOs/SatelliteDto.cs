namespace SpaceManagement.DTOs
{
    public class SatelliteDto : CelestialObjectDto
    {
        public string OrbitType { get; set; }
        public DateTime LaunchDate { get; set; } 
        public string Function { get; set; } 
    }
}
