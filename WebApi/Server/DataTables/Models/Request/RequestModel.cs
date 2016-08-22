namespace DataTables.Models.Request
{
    using DataTables.Models.Filter;
    using System.Collections.Generic;
    using System.Linq;

    class RequestModel
    {
        public IOrderedQueryable<object> Data { get; internal set; }

        public Dictionary<string, FilterRequestModel> Filter { get; internal set; }

        public bool GetIdentifiers { get; internal set; }

        public string IdentifierPropName { get; internal set; }

        public IQueryable Identifiers { get; internal set; }

        public bool IsAscending { get; internal set; }

        public string OrderByPropName { get; internal set; }

        public int Page { get; internal set; }

        public int PageSize { get; internal set; }
    }
}
