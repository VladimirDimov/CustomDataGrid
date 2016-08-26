namespace Server.filters
{
    using DataTables;
    using DataTables.CommonProviders;
    using DataTables.ProcessDataProviders;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Web.Mvc;

    public class DataTableFilter : ActionFilterAttribute
    {
        private ActionResult result;
        private FilterProvider filterProvider;
        private SortProvider sortProvider;
        private RequestParamsManager requestParamsManager;
        private JsonProvider jsonProvider;

        public DataTableFilter()
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
                this.result = new HttpStatusCodeResult(500, ex.Message);
#else
                throw ex;
#endif
            }
        }
    }
}