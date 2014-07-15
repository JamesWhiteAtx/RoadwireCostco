using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RoadwireCostco.Controllers
{
    public class BaseController : Controller
    {
        protected ActionResult RedirectToHashActId(string id)
        {
            string afterHash = ControllerContext.RouteData.GetRequiredString("action").ToLower();
            if (id != null)
            {
                afterHash = afterHash + "?id=" + id;
            }
            return Redirect(Url.Action("Index") + "#" + afterHash);
        }


        public ActionResult Partial(string name)
        {
            return PartialView("Partials/" + name);
        }
    }
}