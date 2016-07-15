namespace PiggyBank.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChildLanguage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Children", "Language", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Children", "Language");
        }
    }
}
