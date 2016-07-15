namespace PiggyBank.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PaymentInterval : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Children", "PocketMoney", c => c.Double(nullable: false));
            AddColumn("dbo.Children", "PaymentInterval", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Children", "PaymentInterval");
            DropColumn("dbo.Children", "PocketMoney");
        }
    }
}
