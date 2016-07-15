using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PiggyBank.Web.Controllers
{
    [AllowAnonymous]
    public class MobileController : Controller
    {
        DatabaseHelper.DatabaseHelper dbhelper = new DatabaseHelper.DatabaseHelper();
        [HttpGet]
       public ActionResult OTP(int id)
        {
           //get child based off one time pin

            int childId = dbhelper.AuthenticateChild(id);
            return Json(new { id = childId }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Details(int id)
        {
            var child = dbhelper.GetChild(id);
            return Json(child, JsonRequestBehavior.AllowGet);
        }


       protected override void Dispose(bool disposing)
       {
           if(disposing)
           {
               dbhelper.Dispose();
           }
           base.Dispose(disposing);
       }
	}
}