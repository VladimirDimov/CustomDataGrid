namespace UnitTests.ProcessDataProviers
{
    using DataTables.ProcessDataProviders;
    using NUnit.Framework;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    class SortProviderTests
    {
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
    }
}
