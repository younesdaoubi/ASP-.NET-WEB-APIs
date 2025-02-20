namespace SpaceManagement.Models
{
    public class Satellite : CelestialObject
    {
        public string OrbitType { get; set; }
        public DateTime LaunchDate { get; set; }
        public string Function { get; set; }
    }
}
