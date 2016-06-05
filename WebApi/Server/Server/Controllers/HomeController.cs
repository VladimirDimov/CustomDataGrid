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
        public ActionResult Index(int page, int pageSize, string filter, string orderBy)
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
                .Where(x => filter == null ? true : string.Join(string.Empty, x.ToArray()).Contains(filter));

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

    public class Data
    {
        public string draw { get; set; }

        public string recordsTotal { get; set; }

        public string recordsFiltered { get; set; }

        public ICollection<ICollection<string>> data { get; set; }
    }
}
