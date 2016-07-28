using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.Models
{
    public class Reward
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "To Do")]
        public string TaskToDo { get; set; }

        [Required]
        public int ChildId { get; set; }

        [Required]
        [Display(Name="Reward For")]
        public string ChildFor { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double RewardAmount { get; set; }

        //Amount to split on pocket balance vs savings balance 
        [Range(0, 100)]
        public double SplitPercentage { get; set; }

    }
}