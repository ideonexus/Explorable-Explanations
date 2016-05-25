using System;
using System.Web.Http;

namespace Molecules3D
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
			GlobalConfiguration.Configuration.Routes.MapHttpRoute(
				name: "Default",
				routeTemplate: "api/{controller}" );
        }
    }
}