using PiggyBank.Web.DatabaseHelper;
using PiggyBank.Web.Models;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace PiggyBank.Web.Controllers
{
    [AllowAnonymous]
    public class MobileController : Controller
    {
        public class JsonpResult : JsonResult
        {
            object data = null;

            public JsonpResult()
            {
            }

            public JsonpResult(object data)
            {
                this.data = data;
            }

            public override void ExecuteResult(ControllerContext controllerContext)
            {
                if (controllerContext != null)
                {
                    HttpResponseBase Response = controllerContext.HttpContext.Response;
                    HttpRequestBase Request = controllerContext.HttpContext.Request;

                    string callbackfunction = Request["callback"];
                    if (string.IsNullOrEmpty(callbackfunction))
                    {
                        return;
                    }
                    Response.ContentType = "application/x-javascript";
                    if (data != null)
                    {
                        JavaScriptSerializer serializer = new JavaScriptSerializer();
                        Response.Write(string.Format("{0}({1});", callbackfunction, serializer.Serialize(data)));
                    }
                }
            }
        }
        DatabaseHelper.DatabaseHelper dbhelper = new DatabaseHelper.DatabaseHelper();
        [HttpGet]
        public JsonpResult OTP(int id)
        {
            //get child based off one time pin

            int childId = dbhelper.AuthenticateChild(id);
            return new JsonpResult(new { id = childId });
        }

        [HttpGet]
        public JsonpResult Details(int id)
        {
            var child = dbhelper.GetChild(id);
            return new JsonpResult(child);
        }

        [HttpGet]
        public JsonpResult GetRewards(int id)
        {
            var rewardsForChild = dbhelper.GetRewardsForChild(id);
            return new JsonpResult(rewardsForChild);
        }

        [HttpGet]
        public JsonpResult GetGoals(int id)
        {
            var goalsForChild = dbhelper.GetGoalsForChild(id);
            return new JsonpResult(goalsForChild);
        }

        [HttpGet]
        public JsonpResult AddGoal(Goal model)
        {
            if (model.ChildId != -1)
            {
                if (model.Image == null)
                {
                    model.Image = "none";
                }
                bool success = dbhelper.AddGoal(model);
                if (success)
                {
                    return new JsonpResult(new { result = WorkStatus.Success.ToString() });
                }
            }

            return new JsonpResult(new { result = WorkStatus.Failed.ToString() });

        }

        public JsonpResult DeleteGoal(int id)
        {
            if (id != -1)
            {
                bool success = dbhelper.DeleteGoal(id);
                if (success)
                {
                    return new JsonpResult(new { result = WorkStatus.Success.ToString() });
                }
            }

            return new JsonpResult(new { result = WorkStatus.Failed.ToString() });

        }

        public JsonpResult Withdraw(int id, int amount)
        {
            if(id != -1)
            {
                var model = new WithdrawlRequest()
                {
                    ChildId = id,
                    Amount = amount,
                    FromSavings = false,
                };

                bool success = dbhelper.AddRequest(model);
                if (success)
                {
                    return new JsonpResult(new { result = WorkStatus.Success.ToString() });
                }
            }
         
            return new JsonpResult(new { result = WorkStatus.Failed.ToString() });

        }

        public JsonpResult Transfer(int id, int amount)
        {
            try
            {
                if (id != -1)
                {
                    var model = new WithdrawlRequest()
                    {
                        ChildId = id,
                        Amount = amount,
                        FromSavings = true,
                    };

                    dbhelper.FutureTranser(model);
                    return new JsonpResult(new { result = WorkStatus.Success.ToString() });
                }

                return new JsonpResult(new { result = WorkStatus.Failed.ToString() });
            }

            catch
            {
                return new JsonpResult(new { result = WorkStatus.Failed.ToString() });
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
    }
}