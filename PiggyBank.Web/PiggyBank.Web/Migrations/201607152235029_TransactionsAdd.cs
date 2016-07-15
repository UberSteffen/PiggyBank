namespace PiggyBank.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TransactionsAdd : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Transactions", "MainBalance", c => c.Double(nullable: false));
            AddColumn("dbo.Transactions", "SavingsBalance", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Transactions", "SavingsBalance");
            DropColumn("dbo.Transactions", "MainBalance");
        }
    }
}
