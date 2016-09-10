namespace DataTables.CommonProviders
{
    using System.Text;
    using System.Web.Mvc;
    using DataTables.CommonProviders.Contracts;
    using Newtonsoft.Json;

    internal class JsonProvider : IJsonProvider
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
            jsonResult.MaxJsonLength = int.MaxValue;
            jsonResult.Data = data;

            return jsonResult;
        }
    }
}
