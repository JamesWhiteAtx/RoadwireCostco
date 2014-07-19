using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace RoadwireCostco
{
    public interface ICcOrderService
    { 
        //IEnumerable<OrderModel> Listing();
        //OrderModel Query(int id);
        JsonModel Insert(JsonModel model);
    }

    public class CcOrderService : ICcOrderService
    {
        private INetSuiteCcOrderUriService _nsUriService;

        public CcOrderService(INetSuiteCcOrderUriService nsRestService)
        {
            _nsUriService = nsRestService;
        }

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

        public JsonModel Insert(JsonModel model) 
        {
            string responseFromServer = String.Empty;

            string uri = _nsUriService.Uri.AbsoluteUri;

            WebRequest request = WebRequest.Create(uri);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";

            _nsUriService.LoadHeaders(request.Headers);

            //string payload = JsonConvert.SerializeObject(model.Json);
            string payload = model.Json;

            byte[] bytes = System.Text.Encoding.ASCII.GetBytes(payload);
            request.ContentLength = bytes.Length;
            System.IO.Stream os = request.GetRequestStream();
            os.Write(bytes, 0, bytes.Length); //Push it out there
            os.Close();

            using (WebResponse response = request.GetResponse())
            {
                using (Stream dataStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(dataStream);
                    responseFromServer = reader.ReadToEnd();
                }
            }

            return new JsonModel { Json = responseFromServer};
        }
    }
}