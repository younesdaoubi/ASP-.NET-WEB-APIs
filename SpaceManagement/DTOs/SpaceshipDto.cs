namespace SpaceManagement.DTOs
{
    public class SpaceshipDto : CelestialObjectDto
    {
        public string Mission { get; set; }
        public DateTime LaunchDate { get; set; }
        public DateTime ReturnDate { get; set; } 
    }
}
