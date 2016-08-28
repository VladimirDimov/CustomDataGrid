namespace UnitTests.ProcessDataProviers
{
    using DataTables.ProcessDataProviders;
    using Helpers;
    using Mocks.DataObjects;
    using NUnit.Framework;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    class SortProviderTests
    {
        #region ValidationTests
        [Test]
        public void ShouldThrowOfTypeWhenNoDataIsProvided()
        {
            var sortProvider = new SortProvider();
            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                sortProvider.SortCollection(null, "propName", true, typeof(object));
            });
        }

        [Test]
        public void ShouldThrowOfTypeWhenNoDataCollectionGenericTypeIsProvided()
        {
            var sortProvider = new SortProvider();
            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                sortProvider.SortCollection(new List<object>().AsQueryable(), "propName", true, null);
            });
        }

        #endregion

        [Test]
        public void ShouldReturnEmptyCollectionIfEmptyCollectionIsProvided()
        {
            var sortProvider = new SortProvider();
            var collection = new List<DataObject>().AsQueryable();

            var sortedCollection = sortProvider.SortCollection(
                collection,
                typeof(DataObject).GetProperties().First().Name,
                true,
                typeof(DataObject));

            Assert.AreEqual(sortedCollection.Count(), 0);
        }

        [Test]
        public void ShouldSortProperlyByAscendingForIntType()
        {
            this.TestSort(5000, "PropInt", true);
        }

        [Test]
        public void ShouldSortProperlyByDescendingForIntType()
        {
            this.TestSort(5000, "PropInt", false);
        }

        [Test]
        public void ShouldSortProperlyByAscendingForStringType()
        {
            this.TestSort(5000, "PropString", true);
        }

        [Test]
        public void ShouldSortProperlyByDescendingForStringType()
        {
            this.TestSort(5000, "PropString", false);
        }

        [Test]
        public void ShouldSortProperlyByAscendingForDateTimeType()
        {
            this.TestSort(5000, "PropDateTime", true);
        }

        [Test]
        public void ShouldSortProperlyByDescendingForDateTimeType()
        {
            this.TestSort(5000, "PropDateTime", false);
        }

        [Test]
        public void ShouldSortProperlyByAscendingForCharType()
        {
            this.TestSort(5000, "PropChar", true);
        }

        [Test]
        public void ShouldSortProperlyByDescendingForCharType()
        {
            this.TestSort(5000, "PropChar", false);
        }

        private void TestSort(int numberOfItems, string propName, bool isAsc)
        {
            var sortProvider = new SortProvider();
            var dataCollectionsGenerator = new DataCollectionsGenerator();

            var collection = dataCollectionsGenerator.GetCollection(numberOfItems);

            var sortedCollection = sortProvider.SortCollection(
                collection,
                propName,
                isAsc,
                typeof(DataObject)).ToList();

            var propInfo = typeof(DataObject).GetProperty(propName);

            for (int i = 0; i < numberOfItems - 2; i++)
            {
                var left = propInfo.GetValue(((DataObject)sortedCollection[i]));
                var right = propInfo.GetValue(((DataObject)sortedCollection[i + 1]));

                if (isAsc)
                {
                    Assert.IsTrue((int)typeof(IComparable).GetMethod("CompareTo").Invoke(left, new object[] { right }) <= 0);
                }
                else
                {
                    Assert.IsTrue((int)typeof(IComparable).GetMethod("CompareTo").Invoke(left, new object[] { right }) >= 0);
                }
            }
        }
    }
}
