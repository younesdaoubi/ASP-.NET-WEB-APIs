namespace SpaceManagement.DTOs
{
    public class AlienDto : CelestialObjectDto
    {
        public string OriginPlanet { get; set; }
        public bool IsFriendly { get; set; }
    }
}
