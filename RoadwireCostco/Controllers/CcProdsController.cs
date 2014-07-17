using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RoadwireCostco.Controllers
{
    public class CcProdsController : ApiController
    {
        private ICcProductService _productService;

        public CcProdsController(ICcProductService productService)
        {
            _productService = productService;
        }

        // GET api/CcProds
        public IEnumerable<CcProductModel> Get()
        {
            return _productService.Listing();
        }

        // GET api/CcProds/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/CcProds
        public HttpResponseMessage Post(CcProductModel prod)
        {
            _productService.Update(prod);
            return Request.CreateResponse(HttpStatusCode.OK, prod);
        }

        // PUT api/CcProds/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/CcProds/5
        public void Delete(int id)
        {
        }
    }
}
