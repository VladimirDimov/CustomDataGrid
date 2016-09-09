using Data;
using DataTables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Examples.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationDbContext context;

        public HomeController()
        {
            this.context = new ApplicationDbContext();
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SingleFilterExample()
        {
            return View();
        }


        public ActionResult FilterPerColumnExample()
        {
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [DataTable]
        public ActionResult GetData()
        {
            var data = this.context.Employees.OrderBy(x => x.Id);
            return View(data);
        }
    }
}