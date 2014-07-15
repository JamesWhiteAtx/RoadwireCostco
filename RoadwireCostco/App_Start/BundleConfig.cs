using System.Web;
using System.Web.Optimization;

namespace RoadwireCostco
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap/bootstrap.js",
                "~/Scripts/bootstrap/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/angular/angular-{version}.js",
                "~/Scripts/angular/angular-route-{version}.js",
                "~/Scripts/angular/angular-resource-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/ui-boots").Include(
                "~/Scripts/angular/ui-bootstrap-custom-tpls-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/animate").Include(
                "~/Scripts/angular/angular-animate-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/angstyles").Include(
                "~/Scripts/angular/route-styles.js"));

            bundles.Add(new ScriptBundle("~/bundles/rwutils").Include(
                "~/Scripts/roadwire/rwservices.js",
                "~/Scripts/roadwire/rwdirectives.js"));

            bundles.Add(new ScriptBundle("~/bundles/costco").Include(
                "~/Scripts/costco/app.js",
                "~/Scripts/costco/controllers.js",
                "~/Scripts/costco/services.js",
                "~/Scripts/costco/directives.js"));

            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                "~/Scripts/utils/app.js",
                "~/Scripts/utils/controllers.js",
                "~/Scripts/utils/services.js"));

            bundles.Add(new ScriptBundle("~/bundles/ccadmin").Include(
                "~/Scripts/ccadmin/app.js",
                "~/Scripts/ccadmin/controllers.js",
                "~/Scripts/ccadmin/services.js"));

            bundles.Add(new ScriptBundle("~/bundles/underscore").Include(
                "~/Scripts/maps/lodash.underscore.js"));


            // Style Bundles
            bundles.Add(new StyleBundle("~/Content/style").Include(
                "~/Content/bootstrap/bootstrap.css",
                "~/Content/site/site.css"));

            bundles.Add(new StyleBundle("~/Content/mvc").Include(
                "~/Content/site/mvc.css"));

            bundles.Add(new StyleBundle("~/Content/costco").Include(
                "~/Content/costco/costco.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
