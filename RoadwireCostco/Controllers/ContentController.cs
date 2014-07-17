using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RoadwireCostco.Controllers
{
    public class ContentController : ApiController
    {
    
        private IContentService _contentService;

        public ContentController(IContentService contentService)
        {
            _contentService = contentService;
        }

        // GET api/Content/
        [HttpGet]
        public IEnumerable<ColorModel> Colors()
        {
            return _contentService.ColorModels();
        }

    }
}
