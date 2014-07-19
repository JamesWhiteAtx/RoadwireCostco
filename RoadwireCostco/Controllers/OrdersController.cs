using System;
using System.Collections.Generic;
using System.IO;
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

        public HttpResponseMessage Post(JsonModel model)
        {
            //string orderResonse = String.Empty;
            JsonModel responseModel = null;
            try
            {
                responseModel = _orderService.Insert(model);
            }
            catch (WebException wex)
            {
                if (wex.Response != null)
                {
                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                        {
                            string error = reader.ReadToEnd();
                            return Request.CreateResponse(errorResponse.StatusCode, error);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e.Message);
            }

            return Request.CreateResponse(HttpStatusCode.OK, responseModel);
        }

    }
}
