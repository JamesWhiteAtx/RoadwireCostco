using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoadwireCostco
{
    public interface ICcProductService
    {
        IEnumerable<CcProductModel> Listing();
        void Update(CcProductModel prod);
        void Update(int id, string description, decimal price, string pageUrl);
    }

    public class CcProductService : ICcProductService
    {
        //private CostcoEntities _costcoEntities;
        //public CcProductService(CostcoEntities costcoEntities)
        //{
        //    _costcoEntities = costcoEntities;
        //}

        public IEnumerable<CcProductModel> Listing()
        {
            //var prods = from p in _costcoEntities.CostcoProducts
            //            where p.ActiveFlag == "Y"
            //            select new CcProductModel
            //            {
            //                ID = p.ID,
            //                Code = p.Code,
            //                Description = p.Description,
            //                Price = p.Price,
            //                LeatherRows = p.LeatherRows,
            //                Heaters = p.SeatHeaters,
            //                PageUrl = p.PageUrl
            //            };

            List<CcProductModel> prods = new List<CcProductModel>();
            return prods;
        }

        public void Update(CcProductModel prod)
        {
            int id = Convert.ToInt32(prod.ID);
            Update(id, prod.Description, prod.Price, prod.PageUrl);
        }

        public void Update(int id, string description, decimal price, string pageUrl)
        {
            //var prod = (from p in _costcoEntities.CostcoProducts
            //            where p.ID == id
            //            select p).FirstOrDefault();

            //if (prod != null)
            //{
            //    prod.Description = description;
            //    prod.Price = price;
            //    prod.PageUrl = pageUrl;

            //    _costcoEntities.SaveChanges();
            //}
        }
    }
}