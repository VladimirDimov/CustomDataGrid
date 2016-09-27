namespace DataTables.Models.Request
{
    using DataTables.Models.Filter;
    using System.Collections.Generic;
    using System.Linq;

    public class RequestModel
    {
        public IOrderedQueryable<object> Data { get; set; }

        public IEnumerable<KeyValuePair<string, FilterRequestModel>> Filter { get; set; }

        public bool GetIdentifiers { get; set; }

        public string IdentifierPropName { get; set; }

        public bool IsAscending { get; set; }

        public string OrderByPropName { get; set; }

        public int Page { get; set; }

        public int PageSize { get; set; }
    }
}
