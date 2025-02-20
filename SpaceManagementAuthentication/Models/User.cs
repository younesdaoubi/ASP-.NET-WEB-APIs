namespace SpaceManagementAuthentication.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; } // Stockage du hash du mot de passe

        public ICollection<UserNotification> Notifications { get; set; } = new List<UserNotification>();


    }

    public class UserNotification
    {
        public int Id { get; set; }
        public int AlienId { get; set; }
        public string Message { get; set; }
        public DateTime NotificationDate { get; set; }
        public string Location { get; set; }
    }
}
