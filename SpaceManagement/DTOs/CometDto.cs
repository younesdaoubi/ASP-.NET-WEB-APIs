namespace SpaceManagement.DTOs
{
    public class CometDto : CelestialObjectDto
    {
        public DateTime NextAppearance { get; set; }
        public string TailColor { get; set; }
    }
}
