namespace DataTables.CommonProviders
{
    using DataTables.CommonProviders.Contracts;
    using Newtonsoft.Json;
    using System.Web.Mvc;

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
