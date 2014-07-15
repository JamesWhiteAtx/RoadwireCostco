using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RoadwireCostco.Controllers
{
    public class NetSuiteController : ApiController
    {
        private INetSuiteUriService _nsService;
        INetSuiteUriSelectorService _netSuiteUriSelectorService;

        public NetSuiteController(INetSuiteUriService nsService, INetSuiteUriSelectorService netSuiteUriSelectorService)
        {
            _nsService = nsService;
            _netSuiteUriSelectorService = netSuiteUriSelectorService;
        }

        private object UrlRespObj(string url)
        {
            return new { url = url };
        }

        // GET api/values
        public HttpResponseMessage Get(string type)
        {
            string typeStr = type.Trim().ToLower();

            if (typeStr == "leaslctr")
            {
                return Request.CreateResponse(HttpStatusCode.OK, UrlRespObj(_netSuiteUriSelectorService.Uri.AbsoluteUri));
            }
            else if (typeStr == "imgbase")
            {
                return Request.CreateResponse(HttpStatusCode.OK, UrlRespObj(_nsService.getUrlImageHost()));
            }
            else if (typeStr == "installers")
            {
                var anonArray = new[] { new { name = "apple", diam = 4 }, new { name = "grape", diam = 1 } };
                return Request.CreateResponse(HttpStatusCode.OK, anonArray);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NoContent, UrlRespObj(String.Empty));
            }
        }

        /*
        // GET
        public HttpResponseMessage Get(string type)
        {
            string typeStr = type.Trim().ToLower();
            
            if (typeStr == "imgbase") 
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlImageHost());
            }
            else if (typeStr == "custrecmake") 
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlCustRecMake());
            }
            else if (typeStr == "custrecmodel")
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlCustRecModel());
            }
            else if (typeStr == "custrecbody")
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlCustRecBody());
            }
            else if (typeStr == "custrectrim")
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlCustRecTrim());
            }
            else if (typeStr == "custreccar")
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlCustRecCar());
            }
            else if (typeStr == "custrecpattern")
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlCustRecPattern());
            }
            else if (typeStr == "item")
            {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(_nsService.getUrlItem());
            }

            else if (typeStr == "webstoreitem")
            {
                var x = _jsonHttpResponseService.GetObjectHttpResponseMessage(new { prefix = "http://shopping.sandbox.netsuite.com/s.nl/c.801095/it.A/id.", suffix = "/.f" });
                return x;
            }
            else {
                return _jsonHttpResponseService.GetStringHttpResponseMessage(String.Empty);
            }
            
        }
        */
    }
}
