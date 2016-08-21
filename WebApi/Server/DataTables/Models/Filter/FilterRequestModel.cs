namespace DataTables.Models.Filter
{
    class FilterRequestModel
    {
        public string Value { get; set; }

        // 0 - equal; 1 - greater than; 2-less than
        public int Operator { get; set; }
    }
}
