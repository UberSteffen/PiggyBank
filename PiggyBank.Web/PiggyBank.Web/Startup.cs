using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PiggyBank.Web.Startup))]
namespace PiggyBank.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
