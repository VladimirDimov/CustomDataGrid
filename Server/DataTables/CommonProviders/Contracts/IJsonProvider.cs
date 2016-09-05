namespace DataTables.CommonProviders.Contracts
{
    using System.Web.Mvc;

    interface IJsonProvider
    {
        T Deserialize<T>(string json);
        JsonResult GetJsonResult(object data, JsonRequestBehavior jsonRequestBehavior = JsonRequestBehavior.AllowGet);
    }
}