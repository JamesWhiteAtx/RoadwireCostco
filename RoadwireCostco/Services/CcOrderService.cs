using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoadwireCostco
{
    public interface ICcOrderService
    { 
        //IEnumerable<OrderModel> Listing();
        //OrderModel Query(int id);
        OrderModel Insert(OrderModel prod);
    }

    public class CcOrderService : ICcOrderService
    {
        //public IEnumerable<OrderModel> Listing() 
        //{
        //    return new List<OrderModel>()
        //    {
        //        new OrderModel {},
        //        new OrderModel {}
        //    };
        //}

        //public OrderModel Query(int id) 
        //{
        //    return new OrderModel();
        //}

        public OrderModel Insert(OrderModel prod) 
        {
            return prod;
        }
    }
}