using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http.Cors;
using System.Web.Mvc;

namespace Server.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HomeController : Controller
    {
        public ActionResult Index(int page, int pageSize, string filter, string orderBy, bool asc)
        {
            // Get data
            var reqData = Request.Params;
            string jsonData = null;
            using (var reader = new StreamReader(this.Server.MapPath("~/app_data/data.txt")))
            {
                jsonData = reader.ReadToEnd();
            }

            var data = JsonConvert.DeserializeObject<Data>(jsonData);


            // Set page
            var filteredData = data.data
                .Where(x => filter == null ? true : x.FirstName.Contains(filter));

            if (!string.IsNullOrEmpty(orderBy))
            {
                var prop = typeof(Person).GetProperty(orderBy);
                if (asc)
                {
                    filteredData = filteredData.OrderBy(x => prop.GetValue(x));
                }
                else
                {
                    filteredData = filteredData.OrderByDescending(x => prop.GetValue(x));
                }
            }

            var resultData = filteredData
                .Skip((page - 1) * pageSize).Take(pageSize);

            return this.Json(new
            {
                data = resultData,
                rowsNumber = filteredData.Count()
            },
            JsonRequestBehavior.AllowGet);
        }
    }

    public class OrderBy
    {
        public string Name { get; set; }

        public bool Asc { get; set; }
    }

    public class Data
    {
        public string draw { get; set; }

        public string recordsTotal { get; set; }

        public string recordsFiltered { get; set; }

        public ICollection<Person> data { get; set; }
    }

    public class Person
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Position { get; set; }

        public string Occupation { get; set; }

        public string StartDate { get; set; }

        public string Salary { get; set; }
    }
}
