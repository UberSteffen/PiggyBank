using PiggyBank.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using PiggyBank.Web.DatabaseHelper;
using WCPS.Class;
using System.Collections;
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
               : message == WorkStatus.SMS ? "Your SMS has been sent."
               : message == WorkStatus.Failed ? "Your transaction was unsuccessful."
               : message == WorkStatus.SMSFail ? "Your SMS failed to send. You may have reached your limit."
               : "";
            IEnumerable<Child> model = dbhelper.GetChildrenForParent(User.Identity.GetUserId());
            return View(model);
        }

        #region Children
        [HttpGet]
        public ActionResult AddChild()
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();
            ViewBag.Languages = dbhelper.Languages;
            return PartialView();
        }

        [HttpPost]
        public ActionResult AddChild(Child model)
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();
            ViewBag.Languages = dbhelper.Languages;
            if (ModelState.IsValid)
            {
                model.ParentId = User.Identity.GetUserId();
                bool success = dbhelper.InsertChild(model);

                if (success)
                {
                    SendSMSOTP(model.Id);
                    return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });
                }
            }

            return PartialView(model);
        }


        [HttpGet]
        public ActionResult EditChild(int id)
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();
            ViewBag.Languages = dbhelper.Languages;

            Child model = dbhelper.GetChild(id);
            return PartialView(model);
        }


        [HttpPost]
        public ActionResult EditChild(Child model)
        {
            ViewBag.PaymentIntervals = dbhelper.GetPaymentIntervals();
            ViewBag.Languages = dbhelper.Languages;

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

            if (ModelState.IsValid)
            {
                bool success = dbhelper.PayChild(model);

                if (success)
                {
                    return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });
                }
            }

            return RedirectToAction("Index", "Child", "Error");

        }


        public ActionResult DeleteChild(int id)
        {
            bool success = dbhelper.DeleteChild(User.Identity.GetUserId(), id);
            if (success)
            {
                return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });

            }

            else
            {
                return RedirectToAction("Index", "Child", new { message = WorkStatus.Failed });

            }
        }

        public ActionResult History(int id)
        {
            var model = dbhelper.GetTransactionsForChild(id);
            return View(model);
        }

        #endregion

        #region Requests

        public ActionResult Requests()
        {
            var model = dbhelper.RequestsForParent(User.Identity.GetUserId());
            return View(model);
        }

        public ActionResult HandleRequest(int id, string task)
        {
            WorkStatus status = dbhelper.HandleRequest(id, User.Identity.GetUserId(), task);
            return RedirectToAction("Requests");
        }
        #endregion
       

        public ActionResult DoPocketMoney(int id)
        {

            bool success = dbhelper.DoPocketMoney(id);
            if (success)
            {
                return RedirectToAction("Index", "Child", new { message = WorkStatus.Success });

            }

            else
            {
                return RedirectToAction("Index", "Child", new { message = WorkStatus.Failed });

            }
        }

        [HttpGet]
        public ActionResult SendOTP(int id)
        {

           bool success = SendSMSOTP(id);
                if(success)
                {
                    return RedirectToAction("Index", "Child", new { message = WorkStatus.SMS });

                }
            
            return RedirectToAction("Index", "Child", new { message = WorkStatus.Failed });
        }


        #region Helpers
        public ActionResult GetChildName(int id)
        {
            var child = dbhelper.GetChild(id);

            if(child != null)
            {
                return Content(child.Name);
            }

            else
            {
                return Content("No Name!");
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                dbhelper.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SendSMSOTP(int id)
        {
            try
            {
                var child = dbhelper.GetChild(id);
                dbhelper.IncrementSMSLimit();
                if(dbhelper.CanSendSMS())
                {
                    string smsMsg = string.Format("Hi {0}, your One-Time-PIN is {1} to access your piggy-bank app. Happy Saving!", child.Name, child.PIN);

                    string dataMsg = SendSMS.seven_bit_message("brazer911", "ovooxich", child.PhoneNumber, smsMsg);
                    Hashtable hash = SendSMS.send_sms(dataMsg, "http://bulksms.2way.co.za:5567/eapi/submission/send_sms/2/2.0");
                    return true;

                }
                return false;
            }
            catch (Exception)
            {
                 return false;
            }

        }
        #endregion
    }
}