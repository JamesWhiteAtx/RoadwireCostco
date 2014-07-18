using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RoadwireCostco.Controllers
{
    public class OrdersController : ApiController
    {
        private ICcOrderService _orderService;

        public OrdersController(ICcOrderService orderService)
	    {
            _orderService = orderService;
        }

        //// GET api/Order
        //public HttpResponseMessage Get()
        //{
        //    IEnumerable<OrderModel> orders = _orderService.Listing();
        //    return Request.CreateResponse(HttpStatusCode.OK, orders);
        //}

        //// GET api/Order/5
        //public HttpResponseMessage Get(int id)
        //{
        //    OrderModel order = _orderService.Query(id);
        //    return Request.CreateResponse(HttpStatusCode.OK, order);
        //}

        // POST api/Order
        public HttpResponseMessage Post(OrderModel order)
        {
            _orderService.Insert(order);
            return Request.CreateResponse(HttpStatusCode.OK, order);
        }

    }
}
