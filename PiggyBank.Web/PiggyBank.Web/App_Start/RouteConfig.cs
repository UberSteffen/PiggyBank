using System.Web.Mvc;
using System.Web.Routing;

namespace PiggyBank.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                       name: "Amount",
                       url: "{controller}/{action}/{id}/{amount}",
                       defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional, amount = UrlParameter.Optional }
                   );
            routes.MapRoute(
              name: "Tasked",
              url: "{controller}/{action}/{id}/{task}",
              defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional, task = UrlParameter.Optional }
          );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
