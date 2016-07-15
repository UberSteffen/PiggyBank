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
                if(model.PayIntoSavings)
                {
                    childToPay.SavingsBalance += model.Amount;

                }

                else
                {
                    childToPay.MainBalance += model.Amount;

                }
                db.Entry(childToPay).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                AddTransaction(childToPay.ParentId, childToPay.Id, TransactionTypes.Deposit);

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
                    AddTransaction(parentId, id, TransactionTypes.DeleteChild);
                }

                return false;
            }

            catch
            {
                return false;
            }
        }

        public bool AddTransaction(string parentId, int childId, TransactionTypes transactionType)
        {
            try
            {
                Transaction trans = new Transaction()
                {
                    TransactionType = transactionType.ToString(),
                    ChildId = childId,
                    ParentId = parentId,
                    TmStamp = DateTime.Now,
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

        #endregion




        private int OneTimePin()
        {
            Random a = new Random();
            return a.Next(1000, 9999);
        }



    }


    public enum WorkStatus
    {
        Success,
        Failed,
        Error
    }

}