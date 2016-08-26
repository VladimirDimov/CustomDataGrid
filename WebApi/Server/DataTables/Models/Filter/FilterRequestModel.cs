namespace DataTables.Models.Filter
{
    public class FilterRequestModel
    {
        public string Value { get; set; }

        // 0 - contains CI
        // 1 - contains CS
        // 2 - = 
        // 3 - > 
        // 4 - <
        // 5 - <=
        // 6 - >=
        public string Operator { get; set; }
    }
}
