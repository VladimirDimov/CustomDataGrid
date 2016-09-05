namespace UnitTests.Helpers
{
    using RandomGen;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using UnitTests.Mocks.DataObjects;

    class DataCollectionsGenerator
    {
        public IQueryable<DataObject> GetCollection(int numberOfItems)
        {
            var collection = new List<DataObject>();
            var ints = Gen.Random.Numbers.Integers(int.MinValue, int.MaxValue);
            var strings = Gen.Random.Names.Full();
            var dateTimes = Gen.Random.Time.Dates(new DateTime(1900, 1, 1), new DateTime(2050, 1, 1));
            var chars = Gen.Random.Names.First();

            for (int i = 0; i < numberOfItems; i++)
            {
                collection.Add(new DataObject
                {
                    PropInt = ints(),
                    PropString = strings(),
                    PropDateTime = dateTimes(),
                    PropChar = chars()[0]
                });
            }

            return collection.AsQueryable();
        }
    }
}
