using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        public string TransactionType { get; set; }

        public string ParentId { get; set; }

        public int ChildId { get; set; }

        public DateTime TmStamp { get; set; }

        public double Amount { get; set; }
    }


    public enum TransactionTypes
    {
        Withdrawl,
        Deposit,
        DeleteChild
    }
}