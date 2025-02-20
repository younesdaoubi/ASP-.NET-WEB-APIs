

using static System.Net.Mime.MediaTypeNames;

namespace SpaceManagement.Models
{
    public class CelestialObject
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ImageId { get; set; } 
        public Image Image { get; set; }   
        public double XCoordinate { get; set; }
        public double YCoordinate { get; set; }
        public double ZCoordinate { get; set; }
    }
}
