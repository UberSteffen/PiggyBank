namespace PiggyBank.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Rewards : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Rewards",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TaskToDo = c.String(nullable: false),
                        ChildId = c.Int(nullable: false),
                        ChildFor = c.String(nullable: false),
                        RewardAmount = c.Double(nullable: false),
                        SplitPercentage = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Rewards");
        }
    }
}
