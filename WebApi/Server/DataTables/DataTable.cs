namespace Server.filters
{
    using DataTables;
    using System;
    using System.Web.Mvc;

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
                filterContext.Result = new HttpStatusCodeResult(500, ex.Message);
#else
                throw ex;
#endif
            }
        }
    }
}