namespace DataTables
{
    using System;
    using System.Diagnostics;
    using System.Web.Mvc;

    /// <summary>
    /// Provides processinbg of the passed IOrderedQueryable collection according to passed data table parameters
    /// </summary>
    public class DataTable : ActionFilterAttribute
    {
        private ActionResult result;

        public DataTable()
        {
        }

        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            this.result = filterContext.Result;
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            var engine = new Engine();
            try
            {
                engine.Run(filterContext);
            }
            catch (Exception ex)
            {
#if (!debug)
                Debug.WriteLine(ex.Message);
                filterContext.Result = new HttpStatusCodeResult(500, ex.Message);
#else
                throw ex;
#endif
            }
        }
    }
}