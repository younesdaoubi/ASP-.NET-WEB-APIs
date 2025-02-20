using SpaceManagement.Models;

namespace SpaceManagement.DTOs
{
    public class CelestialObjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public double XCoordinate { get; set; }  
        public double YCoordinate { get; set; }  
        public double ZCoordinate { get; set; }  
    }
}
