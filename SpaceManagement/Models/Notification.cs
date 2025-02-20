using SpaceManagement.Models;

namespace SpaceManagement.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int AlienId { get; set; }
        public Alien Alien { get; set; }
        public string Message { get; set; }
        public DateTime NotificationDate { get; set; }
        public string Location { get; set; }
    }
}
