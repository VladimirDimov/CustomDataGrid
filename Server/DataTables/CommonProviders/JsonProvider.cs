namespace DataTables.CommonProviders
{
    using System.Web.Helpers;
    using System.Web.Mvc;
    using DataTables.CommonProviders.Contracts;

    internal class JsonProvider : IJsonProvider
    {
        public T Deserialize<T>(string json)
        {
            T obj = Json.Decode<T>(json);

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
