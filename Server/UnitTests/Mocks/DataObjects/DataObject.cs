using System;
using System.Collections.Generic;
using System.Linq;
using RandomGen;

namespace UnitTests.Mocks.DataObjects
{
    public class DataObject
    {
        public string PropString { get; set; }

        public int PropInt { get; set; }

        public DateTime PropDateTime { get; set; }

        public char PropChar { get; set; }

        public IQueryable<DataObject> FakeCollection(int numberOfItems)
        {
            var rndCharInt = RandomGen.Gen.Random.Numbers.Integers(1, 255);
            var rndDateTime = Gen.Random.Time.Dates(new DateTime(1900, 1, 1), new DateTime(2016, 1, 1));
            var rndString = Gen.Random.Text.Short();

            var fakeCollection = new List<DataObject>();

            for (int i = 0; i < numberOfItems; i++)
            {
                fakeCollection.Add(new DataObject
                {
                    PropChar = (char)5,
                    PropDateTime = rndDateTime(),
                    PropInt = rndCharInt(),
                    PropString = rndString()
                });
            }

            return fakeCollection.AsQueryable();
        }
    }
}
