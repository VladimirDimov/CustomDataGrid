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
            return this.View();
        }

        public ActionResult SingleFilterExample()
        {
            return this.View();
        }

        public ActionResult EditableExample()
        {
            return this.View();
        }

        public ActionResult FilterPerColumnExample()
        {
            return this.View();
        }

        public ActionResult PaginatorTemplateExample()
        {
            return this.View();
        }

        public ActionResult SelectAllExample()
        {
            return this.View();
        }

        public ActionResult NoTableExample()
        {
            return this.View();
        }

        public ActionResult Contact()
        {
            return this.View();
        }

        [DataTable]
        public ActionResult GetData()
        {
            var data = this.context.Employees.OrderBy(x => x.Id);
            return this.View(data);
        }
    }
}