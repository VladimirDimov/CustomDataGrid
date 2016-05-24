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
        public ActionResult Index()
        {
            string jsonData = null;
            using (var reader = new StreamReader(this.Server.MapPath("~/app_data/data.txt")))
            {
                jsonData = reader.ReadToEnd();
            }

            var data = JsonConvert.DeserializeObject<Data>(jsonData);
            return this.Json(data, JsonRequestBehavior.AllowGet);
        }
    }

    public class Data
    {
        public string draw { get; set; }

        public string recordsTotal { get; set; }

        public string recordsFiltered { get; set; }

        public ICollection<ICollection<string>> data { get; set; }
    }
}
