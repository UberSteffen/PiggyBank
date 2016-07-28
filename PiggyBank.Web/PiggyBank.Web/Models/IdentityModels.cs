using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;

namespace PiggyBank.Web.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string EmailAddress { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }


        public DbSet<Child> Children { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<Setting> Settings { get; set; }

        public DbSet<WithdrawlRequest> Requests { get; set; }

        public DbSet<Reward> Rewards { get; set; }
    }
}