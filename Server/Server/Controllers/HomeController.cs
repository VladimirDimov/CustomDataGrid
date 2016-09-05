using Data;
using Newtonsoft.Json;
using Server.filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Http.Cors;
using System.Web.Mvc;

namespace Server.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HomeController : Controller
    {
        [DataTable]
        public ActionResult Index()
        {
            // Get data
            var reqData = Request.Params;
            string jsonData = null;
            using (var reader = new StreamReader(this.Server.MapPath("~/app_data/data.txt")))
            {
                jsonData = reader.ReadToEnd();
            }

            var data = JsonConvert.DeserializeObject<Data>(jsonData);

            return View(data.data.AsQueryable());
        }

        [DataTable]
        public ActionResult IndexDb()
        {
            var dbContext = new ApplicationDbContext();

            return View("Index", dbContext.Employees.OrderBy(x => x.Id));
        }

        private string ConcatProperties(object obj)
        {
            var propInfos = obj.GetType().GetProperties();
            var builder = new StringBuilder();
            foreach (var propInfo in propInfos)
            {
                builder.Append(propInfo.GetValue(obj));
            }

            return builder.ToString();
        }
    }

    public class OrderBy
    {
        public string Name { get; set; }

        public bool Asc { get; set; }
    }

    public class Data
    {
        //public string draw { get; set; }

        //public string recordsTotal { get; set; }

        //public string recordsFiltered { get; set; }

        public List<Person> data { get; set; }
    }

    public class Person
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Position { get; set; }

        public string Occupation { get; set; }

        public string StartDate { get; set; }

        public string Salary { get; set; }
    }
}
