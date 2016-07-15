namespace PiggyBank.Web.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using PiggyBank.Web.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<PiggyBank.Web.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(PiggyBank.Web.Models.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            if (!context.Roles.Any(r => r.Name == "Admin"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var admin = new IdentityRole { Name = "Admin" };
                var user = new IdentityRole { Name = "User" };

                manager.Create(admin);
                manager.Create(user);

            }

            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            if (!context.Users.Any(x => x.EmailAddress == "piggytest@bbd.co.za"))
            {
                string emailUsername = "piggytest@bbd.co.za";
                var adminUser = new ApplicationUser() { UserName = emailUsername, EmailAddress = emailUsername, LastName = "User", FirstName="Test" };
                userManager.Create(adminUser, "Test@123");
            }
        }
    }
}
