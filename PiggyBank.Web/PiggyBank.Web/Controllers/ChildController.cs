using PiggyBank.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using PiggyBank.Web.DatabaseHelper;
namespace PiggyBank.Web.Controllers
{
    [Authorize]
    public class ChildController : Controller
    {

        DatabaseHelper.DatabaseHelper dbhelper = new DatabaseHelper.DatabaseHelper();

        public ActionResult Index(WorkStatus? message)
        {
            ViewBag.StatusMessage =
               message == WorkStatus.Success ? "Your transaction was successful."
               : message == WorkStatus.Failed ? "Your transaction was unsuccessful."
               : "";
            IEnumerable<Child> model = dbhelper.GetChildrenForParent(User.Identity.GetUserId());
            return View(model);
        }

        [HttpGet]
        public ActionResult AddChild()
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();
            return PartialView();
        }

        [HttpPost]
        public ActionResult AddChild(Child model)
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();
            if (ModelState.IsValid)
            {
                model.ParentId = User.Identity.GetUserId();
                bool success = dbhelper.InsertChild(model);

                if (success)
                {
                    return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });
                }
            }

            return PartialView(model);
        }


        [HttpGet]
        public ActionResult EditChild(int id)
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();

            Child model = dbhelper.GetChild(id);
            return PartialView(model);
        }


        [HttpPost]
        public ActionResult EditChild(Child model)
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();
            if (ModelState.IsValid)
            {
                model.ParentId = User.Identity.GetUserId();
                bool success = dbhelper.EditChild(model);

                if (success)
                {
                    return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });
                }
            }

            return RedirectToAction("Index", "Child", new { message = WorkStatus.Failed });

        }

        [HttpGet]
        public ActionResult PayChild(int id)
        {
            PaymentModel model = new PaymentModel()
            {
                ChildId = id,
            };

            return PartialView(model);
        }

        [HttpPost]
        public ActionResult PayChild(PaymentModel model)
        {
         
            if(ModelState.IsValid)
            {
                bool success = dbhelper.PayChild(model);

                if (success)
                {
                    return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });
                }
            }

             return RedirectToAction("Index","Child","Error");

        }


        
        public ActionResult DeleteChild(int id)
        {
            bool success = dbhelper.DeleteChild(User.Identity.GetUserId(), id);
            if(success)
            {
                return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });

            }

            else
            {
                return RedirectToAction("Index", "Child", new { message = WorkStatus.Failed });

            }
        }
        #region Helpers

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                dbhelper.Dispose();
            }
            base.Dispose(disposing);
        }
        #endregion
    }
}