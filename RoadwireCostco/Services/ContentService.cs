using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace RoadwireCostco
{
    public interface IContentService
    {
        IEnumerable<FileInfo> ColorFiles();
        IEnumerable<ColorModel> ColorModels();
    }

    public class ContentService : IContentService
    {
        const string colorPath = "/content/images/colors";

        public IEnumerable<FileInfo> ColorFiles()
        {
            string path = System.Web.Hosting.HostingEnvironment.MapPath(colorPath);
            DirectoryInfo folder = new DirectoryInfo(path);
            return folder.GetFiles();
        }

        public IEnumerable<ColorModel> ColorModels()
        {
            var colors = from file in ColorFiles()
                         select new ColorModel
                         {
                             Code = Path.GetFileNameWithoutExtension(file.Name),
                             Url = colorPath + "/" + file.Name
                         };
            
            return colors.ToList();
        }

    }

}