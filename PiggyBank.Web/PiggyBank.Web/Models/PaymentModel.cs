using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.Models
{
    public class PaymentModel
    {
        public int ChildId { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public double Amount { get; set; }

        [Display(Name="Payment")]
        [Required(ErrorMessage="Please select a payment method.")]
        public string PaymentMethod { get; set; }
    }
}