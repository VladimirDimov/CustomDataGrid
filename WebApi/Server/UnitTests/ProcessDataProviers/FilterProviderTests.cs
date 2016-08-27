using DataTables.Models.Filter;
using DataTables.ProcessDataProviders;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.ProcessDataProviers
{
    class FilterProviderTests
    {
        // Input validation
        [Test]
        public void ShouldThrowOfTypeIfNoDataCollectionGenericTypeIsProvided()
        {
            var provider = new FilterProvider();

            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                provider.FilterData(null, new List<object>().AsQueryable(), new Dictionary<string, FilterRequestModel>());
            });
        }

        [Test]
        public void ShouldThrowOfTypeIfNoDataIsProvided()
        {
            var provider = new FilterProvider();

            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                provider.FilterData(typeof(object), null, new Dictionary<string, FilterRequestModel>());
            });
        }

        [Test]
        public void ShouldThrowOfTypeIfNoFiltersDictionaryIsProvided()
        {
            var provider = new FilterProvider();

            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                provider.FilterData(typeof(object), new List<object>().AsQueryable(), null);
            });
        }
    }
}
