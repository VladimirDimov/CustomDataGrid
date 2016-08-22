using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace DataTables.CommonProviders
{
    class JsonProvider : IJsonProvider
    {
        public T Deserialize<T>(string json)
        {
            T obj = JsonConvert.DeserializeObject<T>(json);

            return obj;
        }

        public JsonResult GetJsonResult(object data, JsonRequestBehavior jsonRequestBehavior = JsonRequestBehavior.AllowGet)
        {
            var jsonResult = new JsonResult();
            jsonResult.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            jsonResult.Data = data;

            return jsonResult;
        }
    }
}
