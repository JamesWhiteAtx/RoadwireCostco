using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RoadwireCostco.Controllers
{
    public class HomeController : BaseController
    {
        // GET: Costco
        public ActionResult Index()
        {
            return View();
        }

    }
}