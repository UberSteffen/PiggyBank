using System.ComponentModel.DataAnnotations;

namespace PiggyBank.Web.Models
{
    public class Child
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Language { get; set; }


        [Required]
        [Display(Name = "Phone Number")]
        [Phone]
        public string PhoneNumber { get; set; }

        public string ParentId { get; set; }

        [Required]
        [Display(Name = "Pocket Balance")]
        [Range(0, double.MaxValue)]
        public double MainBalance { get; set; }

        [Required]
        [Display(Name = "Savings Balance")]
        [Range(0, double.MaxValue)]
        public double SavingsBalance { get; set; }

        [Required]
        [Display(Name = "Interest on Savings")]
        [Range(0, 100, ErrorMessage = "Please enter valid percentage")]
        public double PercentToSave { get; set; }

        [Required]
        [Display(Name = "Pocket Money")]
        [Range(0, double.MaxValue)]
        public double PocketMoney { get; set; }

        [Required]
        [Display(Name = "Payment Interval")]
        public string PaymentInterval { get; set; }
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