namespace SpaceManagement.Models
{
    public class Spaceship : CelestialObject
    {
        public string Mission { get; set; }
        public DateTime LaunchDate { get; set; }

        public DateTime ReturnDate { get; set; }
    }
}
