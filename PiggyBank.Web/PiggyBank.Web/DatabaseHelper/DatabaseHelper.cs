using PiggyBank.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PiggyBank.Web.DatabaseHelper
{
    public class DatabaseHelper : IDisposable
    {
        public ApplicationDbContext db { get; set; }

        public DatabaseHelper()
        {
            db = new ApplicationDbContext();
        }
        public void Dispose()
        {
            db.Dispose();
        }


        #region Children

        public IEnumerable<Child> GetChildrenForParent(string parentId)
        {
            try
            {

                var childList = db.Children.Where(x => x.ParentId == parentId);
                return childList;
            }

            catch
            {
                return new List<Child>();
            }
        }


        public List<string> GetPaymentIntervals()
        {
            return Enum.GetValues(typeof(PaymentIntervals)).Cast<PaymentIntervals>().Select(x => x.ToString()).ToList();
        }


        public bool InsertChild(Child model)
        {
            try
            {
                model.Activated = false;
                model.PIN = OneTimePin();
                db.Children.Add(model);
                db.SaveChanges();
                return true;
            }

            catch
            {
                return false;
            }
        }

        public bool EditChild(Child model)
        {
            try
            {
                var childToEdit = db.Children.Find(model.Id);
                childToEdit.Name = model.Name;
                childToEdit.MainBalance = model.MainBalance;
                childToEdit.SavingsBalance = model.SavingsBalance;
                childToEdit.PocketMoney = model.PocketMoney;
                childToEdit.PercentToSave = model.PercentToSave;
                childToEdit.PaymentInterval = model.PaymentInterval;
                childToEdit.PhoneNumber = model.PhoneNumber;
                childToEdit.Language = model.Language;
                var entry = db.Entry(childToEdit);
                entry.State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return true;
            }

            catch
            {
                return false;
            }
        }

        public Child GetChild(int id)
        {
            try
            {
                return db.Children.Find(id);
            }

            catch
            {
                return new Child();
            }
        }


        public bool PayChild(PaymentModel model)
        {
            try
            {
                var childToPay = db.Children.Find(model.ChildId);

                double moneyToSave = childToPay.PercentToSave / 100 * model.Amount;
                switch(model.PaymentMethod)
                {
                    case "Pocket": childToPay.MainBalance += model.Amount;
                        AddTransaction(childToPay.ParentId, childToPay.Id, model.Amount, 0, model.Amount, TransactionTypes.Deposit);

                        break;
                    case "Savings": childToPay.SavingsBalance += model.Amount;
                        AddTransaction(childToPay.ParentId, childToPay.Id, model.Amount, model.Amount, 0, TransactionTypes.Deposit);

                        break;
                    case "Split": childToPay.MainBalance += model.Amount - moneyToSave;
                        childToPay.MainBalance += moneyToSave;
                        AddTransaction(childToPay.ParentId, childToPay.Id, model.Amount, moneyToSave, model.Amount - moneyToSave, TransactionTypes.Deposit);

                        break;
                }


                db.Entry(childToPay).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();

             

             



                return true;
            }

            catch
            {
                return false;
            }
        }

        public bool DeleteChild(string parentId, int id)
        {
            try
            {
                var childToDelete = db.Children.Find(id);


                //Securiy
                if (childToDelete.ParentId == parentId)
                {
                    db.Entry(childToDelete).State = System.Data.Entity.EntityState.Deleted;
                    db.SaveChanges();
                    AddTransaction(parentId, id, 0,0,0 ,TransactionTypes.DeleteChild);
                }

                return false;
            }

            catch
            {
                return false;
            }
        }

        public bool AddTransaction(string parentId, int childId, double amount, double savingsAmount, double pocketAmount, TransactionTypes transactionType)
        {
            try
            {
                Transaction trans = new Transaction()
                {
                    TransactionType = transactionType.ToString(),
                    ChildId = childId,
                    ParentId = parentId,
                    TmStamp = DateTime.Now,
                    Amount = amount,
                    SavingsBalance = savingsAmount,
                    MainBalance = pocketAmount,
                };

                db.Transactions.Add(trans);
                db.SaveChanges();
                return true;
            }

            catch
            {
                return false;
            }
        }


        public bool DoPocketMoney(int id)
        {
            try
            {
                var childToAdd = db.Children.Find(id);
                double moneyToSave = Math.Round(childToAdd.PocketMoney * (childToAdd.PercentToSave / 100), 2);
                childToAdd.MainBalance += childToAdd.PocketMoney - moneyToSave;
                childToAdd.SavingsBalance += moneyToSave;
                db.Entry(childToAdd).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                AddTransaction(childToAdd.ParentId, childToAdd.Id, childToAdd.PocketMoney, moneyToSave, childToAdd.PocketMoney - moneyToSave, TransactionTypes.PocketMoney);
                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion

        #region Settings

        public void IncrementSMSLimit()
        {
            Setting smsLimit = GetSetting("SMSLimit");
            if (smsLimit == null)
            {
                smsLimit = new Setting()
                {
                    Name = "SMSLimit",
                    Value = "1",
                };

                AddSetting(smsLimit);
            }

            else
            {
                smsLimit.Value = (Convert.ToInt32(smsLimit.Value) + 1).ToString();
                EditSetting(smsLimit);
            }
        }

        public Setting GetSetting(string name)
        {
            var setting = db.Settings.FirstOrDefault(x => x.Name == name);
            return setting;
        }

        public bool AddSetting(Setting setting)
        {
            try
            {
                db.Settings.Add(setting);
                db.SaveChanges();
                return true;
            }

            catch
            {
                return false;
            }
        }

        public bool EditSetting(Setting setting)
        {

            try
            {
                db.Entry(setting).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                return true;
            }

            catch
            {
                return false;
            }

        }

        public bool CanSendSMS()
        {

            try
            {
                var smsLimit = GetSetting("SMSLimit");

                if (Convert.ToInt32(smsLimit.Value) > 10)
                {
                    return false;
                }
                return true;
            }

            catch
            {
                return false;
            }

        }

        #endregion

        #region Requests
        public bool AddRequest(WithdrawlRequest model)
        {
            try
            {
                if (CanAddRequest(model.ChildId))
                {
                    model.TmStamp = DateTime.Now;
                    db.Requests.Add(model);
                    db.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception)
            {

                return false;
            }
        }

        private bool CanAddRequest(int childId)
        {
            try
            {
                var requestsFromChild = db.Requests.Where(x => x.ChildId == childId ).ToList();
                if (requestsFromChild != null && requestsFromChild.Count() > 0)
                {
                    return false;
                }

                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public IEnumerable<WithdrawlRequest> RequestsForParent(string parentId)
        {
            try
            {
                List<WithdrawlRequest> requestsForParent = new List<WithdrawlRequest>();
                var childrenForParent = GetChildrenForParent(parentId);
                foreach (var child in childrenForParent)
                {
                    var requestsFromChild = db.Requests.Where(x => x.ChildId == child.Id);
                    requestsForParent.AddRange(requestsFromChild);
                }

                return requestsForParent;
            }

            catch
            {
                return new List<WithdrawlRequest>();
            }
        }

        public int RequestsCount(string parentId)
        {
            int count = 0;
            try
            {
                count = RequestsForParent(parentId).Count();
                return count;
            }

            catch
            {
                count = -1;
                return count;
            }

         
        }

        public WorkStatus HandleRequest(int childId, string parentId, string action)
        {
            try
            {
                var requestToHandel = db.Requests.Find(childId);

                if (string.IsNullOrEmpty(action) || requestToHandel == null)
                {
                    return WorkStatus.Failed;
                }


                switch (action)
                {
                    case "approve": ApproveRequest(parentId,requestToHandel); return WorkStatus.Approved;
                    case "deny": DenyRequest(requestToHandel); return WorkStatus.Denied;
                    default: return WorkStatus.Failed;
                }

            }
            catch (Exception)
            {
                return WorkStatus.Failed;
            }
        }

        public void FutureTranser(WithdrawlRequest requestToHandel)
        {
            var child = GetChild(requestToHandel.ChildId);
            AddTransaction(child.ParentId, child.Id, requestToHandel.Amount,-requestToHandel.Amount, requestToHandel.Amount, TransactionTypes.NoticePeriodTransfer);
        }

        private void ApproveRequest(string parentId,WithdrawlRequest model)
        {
            AddTransaction(parentId, model.ChildId, -model.Amount,0,-model.Amount,  TransactionTypes.Withdrawl);
            DeleteRequest(model);

        }

        private void DenyRequest(WithdrawlRequest model)
        {
            DeleteRequest(model);
        }

        private bool DeleteRequest(WithdrawlRequest model)
        {
            try
            {
                db.Entry(model).State = System.Data.Entity.EntityState.Deleted;
                db.SaveChanges();
                return true;
            }

            catch
            {
                return false;
            }
        }

        #endregion

        public IEnumerable<Transaction> GetTransactionsForChild(int id)
        {
            try
            {
                var transactions = from x in db.Transactions
                                   where x.ChildId == id
                                   select x;
                return transactions;
            }
            catch
            {
                return new List<Transaction>();
            }
        }

        private int OneTimePin()
        {
            Random a = new Random();
            return a.Next(1000, 9999);
        }


        public string[] Languages = new string[] { "English", "Afrikaans", "isiZulu" };
        public int AuthenticateChild(int OTP)
        {
            try
            {
                var child = db.Children.Where(x => x.PIN == OTP).FirstOrDefault();
                if (child != null)
                {
                    child.Activated = true;
                    EditChild(child);
                    return child.Id;
                }

                return -1;
            }

            catch
            {
                return -1;
            }
        }

    }


    public enum WorkStatus
    {
        Success,
        Failed,
        Error,
        SMS,
        SMSFail,
        Approved,
        Denied
    }

}