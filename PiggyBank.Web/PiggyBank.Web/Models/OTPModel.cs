using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.Models
{
    public class OTPModel
    {
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        public int ChildId { get; set; }

        public string ChildName { get; set; }
    }
}