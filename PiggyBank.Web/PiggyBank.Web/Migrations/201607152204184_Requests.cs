namespace PiggyBank.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Requests : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.WithdrawlRequests",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ChildId = c.Int(nullable: false),
                        Amount = c.Double(nullable: false),
                        TmStamp = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.WithdrawlRequests");
        }
    }
}
