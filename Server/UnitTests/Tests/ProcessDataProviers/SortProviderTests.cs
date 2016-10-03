namespace UnitTests.ProcessDataProviers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using DataTables.Models.Request;
    using DataTables.ProcessDataProviders;
    using Helpers;
    using Mocks.DataObjects;
    using NUnit.Framework;

    internal class SortProviderTests
    {
        #region ValidationTests

        [Test]
        public void ShouldThrowOfTypeWhenNoDataIsProvided()
        {
            var sortProvider = new SortProvider();
            var requestModel = new RequestModel { OrderByPropName = "propName", IsAscending = true };

            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                sortProvider.Execute(null, requestModel, typeof(object));
            });
        }

        [Test]
        public void ShouldThrowOfTypeWhenNoDataCollectionGenericTypeIsProvided()
        {
            var sortProvider = new SortProvider();
            var requestModel = new RequestModel { OrderByPropName = "propName", IsAscending = true };

            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                sortProvider.Execute(new List<object>().AsQueryable(), requestModel, null);
            });
        }

        #endregion ValidationTests

        [Test]
        public void ShouldReturnEmptyCollectionIfEmptyCollectionIsProvided()
        {
            var sortProvider = new SortProvider();
            var collection = new List<DataObject>().AsQueryable();
            var requestModel = new RequestModel { OrderByPropName = "PropString", IsAscending = true };

            var sortedCollection = sortProvider.Execute(
                collection,
                requestModel,
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

        [Test]
        public void ShouldSortByStringPropertyCaseInsensitive()
        {
            var sortProvider = new SortProvider();
            var collection = new List<DataObject>()
            {
                new DataObject {PropString = "c" },
                new DataObject {PropString = "e" },
                new DataObject {PropString = "a" },
                new DataObject {PropString = "B" },
                new DataObject {PropString = "D" },
            }.AsQueryable();

            var requestModel = new RequestModel { OrderByPropName = "PropString", IsAscending = true };

            var orderedCollection = sortProvider
                .Execute(collection, requestModel, typeof(DataObject))
                .ToList();
            for (int i = 0; i < collection.Count() - 2; i++)
            {
                string left = ((DataObject)orderedCollection[i]).PropString.ToLower();
                string right = ((DataObject)orderedCollection[i + 1]).PropString.ToLower();

                Assert.IsTrue(string.Compare(left, right) <= 0);
            }
        }

        private void TestSort(int numberOfItems, string propName, bool isAsc)
        {
            var sortProvider = new SortProvider();
            var dataCollectionsGenerator = new DataCollectionsGenerator();

            var collection = dataCollectionsGenerator.GetCollection(numberOfItems);

            var requestModel = new RequestModel { OrderByPropName = propName, IsAscending = isAsc };

            var sortedCollection = sortProvider.Execute(
                collection,
                requestModel,
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
