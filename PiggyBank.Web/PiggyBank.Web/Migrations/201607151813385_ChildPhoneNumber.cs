namespace PiggyBank.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChildPhoneNumber : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Children", "PhoneNumber", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Children", "PhoneNumber");
        }
    }
}
