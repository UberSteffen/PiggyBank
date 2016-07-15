namespace PiggyBank.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class WithdrawlFromSavings : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.WithdrawlRequests", "FromSavings", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.WithdrawlRequests", "FromSavings");
        }
    }
}
