using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.Models
{
    public class WithdrawlRequest
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ChildId { get; set; }
        [Required]
        public double Amount { get; set; }

        public DateTime TmStamp { get; set; }

        public bool FromSavings { get; set; }
    }
}