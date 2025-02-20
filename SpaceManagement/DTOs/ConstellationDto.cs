namespace SpaceManagement.DTOs
{
    public class ConstellationDto : CelestialObjectDto
    {
        public string MainStars { get; set; }
        public string BestViewingMonths { get; set; }
    }
}
