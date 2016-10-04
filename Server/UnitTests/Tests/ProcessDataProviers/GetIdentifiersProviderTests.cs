namespace UnitTests.Tests.GetIdentifiersProvider
{
    using System;
    using System.Linq;
    using DataTables.Models.Request;
    using DataTables.ProcessDataProviders.Contracts;
    using Mocks.DataObjects;
    using NUnit.Framework;

    public class GetIdentifiersProviderTests
    {
        IGetIdentifiersProvider getIdentifiersProvider = new DataTables.ProcessDataProviders.GetIdentifiersProvider();
        IQueryable<DataObject> data = new DataObject().FakeCollection(100);

        [Test]
        public void ShouldReturnErrorIfGetIdentifiersIsFalse()
        {
            var requestModel = new RequestModel { GetIdentifiers = false };
            var identifiers = getIdentifiersProvider.Execute(data, requestModel, typeof(DataObject));

            Assert.IsNull(identifiers);
        }

        [Test]
        public void ShouldThrowOfTypeIfGetIdentifiersIsTrueAndNoIdentifierPropertyNameIsProvided()
        {
            var requestModel = new RequestModel { GetIdentifiers = true, IdentifierPropName = null };

            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                getIdentifiersProvider.Execute(data, requestModel, typeof(DataObject));
            });
        }

        [Test]
        public void ShouldThrowOfTypeIfNullDataIsProvided()
        {
            var requestModel = new RequestModel { GetIdentifiers = true, IdentifierPropName = "PropString" };
            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                getIdentifiersProvider.Execute(null, requestModel, typeof(DataObject));
            });
        }

        [Test]
        public void ShouldThrowOfTypeIfInvalidPropertyNameIsProvided()
        {
            var requestModel = new RequestModel { GetIdentifiers = true, IdentifierPropName = "SomeInvalidPropertyName" };
            Assert.Throws(typeof(ArgumentException), () =>
            {
                getIdentifiersProvider.Execute(data, requestModel, typeof(DataObject));
            });
        }

        [Test]
        public void ShouldReturnProperResult()
        {
            var requestModel = new RequestModel { GetIdentifiers = true, IdentifierPropName = "PropInt" };
            var result = getIdentifiersProvider.Execute(data, requestModel, typeof(DataObject));
            var dataAsList = data.ToList();

            var counter = 0;
            foreach (var item in result)
            {
                var expected = dataAsList[counter].PropInt;
                Assert.AreEqual(expected, item);
                counter++;
            }
        }
    }
}
