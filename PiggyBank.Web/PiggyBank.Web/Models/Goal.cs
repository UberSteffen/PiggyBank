using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.Models
{
    public class Goal
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ChildId { get; set; }

        [Required]
        [Display(Name = "Goal Name")]
        public string GoalName { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double GoalAmount { get; set; }

        [Required]
        [Display(Name = "Image")]
        public string Image { get; set; }

    }
}