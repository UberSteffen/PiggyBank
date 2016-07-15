using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.Models
{
    public class Child
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string ParentId { get; set; }

        [Required]
        [Display(Name="Main Balance")]
        [Range(0, double.MaxValue)]
        public double MainBalance { get; set; }

        [Required]
        [Display(Name = "Savings Balance")]
        [Range(0, double.MaxValue)]
        public double SavingsBalance { get; set; }

        [Required]
        [Display(Name="Percentage To Save")]
        [Range(0, 100, ErrorMessage = "Please enter valid percentage")]
        public double PercentToSave { get; set; }

        [Required]
        [Display(Name = "Pocket Money")]
        [Range(0, double.MaxValue)]
        public double PocketMoney { get; set; }

        [Required]
        [Display(Name="Payment Interval")]
        public string PaymentInterval        { get; set; }
        public int PIN { get; set; }

        public bool Activated { get; set; }
    }

    public enum PaymentIntervals
    {
        Never,
        Weekly,
        Monthly,
        Annually
    }
}