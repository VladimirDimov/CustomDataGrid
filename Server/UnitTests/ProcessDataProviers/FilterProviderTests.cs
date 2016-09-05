namespace UnitTests.ProcessDataProviers
{
    using DataTables.Models.Filter;
    using DataTables.ProcessDataProviders;
    using Helpers;
    using Mocks.DataObjects;
    using Moq;
    using NUnit.Framework;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    class FilterProviderTests
    {
        #region ValidationTests
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
        #endregion

        [Test]
        public void ShouldReturnAllItemsIfFilterWIthEmptyValueIsProvided()
        {
            var dataCollectionsGenerator = new DataCollectionsGenerator();
            var data = dataCollectionsGenerator.GetCollection(5000);
            var numberOfItems = data.Count();

            var filterProvider = new FilterProvider();
            var filters = new Dictionary<string, FilterRequestModel>()
            {
                { "PropString PropInt", new FilterRequestModel {Operator = "=" , Value = ""} },
                { "PropInt", new FilterRequestModel {Operator = "<" , Value = ""} },
            };

            var orderedData = filterProvider.FilterData(typeof(DataObject), data, filters);

            Assert.AreEqual(numberOfItems, orderedData.Count());
        }

        [Test]
        public void ShouldReturnPropperResultForFilterByContainsForString()
        {
            var collection = new List<DataObject>();
            for (int i = 0; i < 5000; i++)
            {
                collection.Add(new DataObject { PropString = "Prefix_searchkey_Suffix" });
            }

            for (int i = 0; i < 3000; i++)
            {
                collection.Add(new DataObject { PropString = "Prefix_somekey_Suffix" });
            }

            var rnd = new Random();
            collection = collection.OrderBy(x => rnd.Next()).ToList();

            var filterProvider = new FilterProvider();
            var filters = new Dictionary<string, FilterRequestModel>()
            {
                { "PropString", new FilterRequestModel {Operator = "ci" , Value = "searchkey"} },
            };

            var filteredCollection = filterProvider.FilterData(typeof(DataObject), collection.AsQueryable(), filters);

            Assert.AreEqual(5000, filteredCollection.Count());
        }

        [Test]
        public void ShouldReturnPropperResultForFilterByContainsForInt()
        {
            var data = new List<DataObject>();
            for (int i = 0; i < 5000; i++)
            {
                data.Add(new DataObject { PropInt = 123777890 });
            }

            for (int i = 0; i < 3000; i++)
            {
                data.Add(new DataObject { PropInt = 111111111 });
            }

            var rnd = new Random();
            data = data.OrderBy(x => rnd.Next()).ToList();

            var filterProvider = new FilterProvider();
            var filters = new Dictionary<string, FilterRequestModel>()
            {
                { "PropInt", new FilterRequestModel {Operator = "ci" , Value = "777"} },
            };

            var filteredCollection = filterProvider.FilterData(typeof(DataObject), data.AsQueryable(), filters);

            Assert.AreEqual(5000, filteredCollection.Count());
        }

        [Test]
        public void ShouldThrowIfFilteredByGreaterThanForString()
        {
            var data = new List<DataObject>();
            var filterProvider = new FilterProvider();
            var filters = new Dictionary<string, FilterRequestModel>()
            {
                { "PropString", new FilterRequestModel {Operator = ">" , Value = "1"} },
            };

            Assert.Throws(typeof(InvalidOperationException), () =>
            {
                var filteredData = filterProvider.FilterData(typeof(DataObject), data.AsQueryable(), filters);
            });
        }

        [Test]
        public void ShouldReturnProperResultForFilterByLessThanForInt()
        {
            this.TestFilterComparables(
                            new Dictionary<int, int>()
                            {
                                    { 5, 3000},
                                    { 10, 4000},
                                    { 15, 5000},
                            },
                            oper: "<", fitlerVal: "15",
                            expectNum: 7000,
                            propName: "PropInt");
        }

        [Test]
        public void ShouldReturnProperResultForFilterByLessThanOrEqualForInt()
        {
            this.TestFilterComparables(
                            new Dictionary<int, int>()
                            {
                                    { 5, 3000},
                                    { 10, 4000},
                                    { 15, 5000},
                            },
                            oper: "<=", fitlerVal: "10",
                            expectNum: 7000,
                            propName: "PropInt");
        }

        [Test]
        public void ShouldReturnProperResultForGreaterThanForInt()
        {
            this.TestFilterComparables(
                            new Dictionary<int, int>()
                            {
                                    { 5, 3000},
                                    { 10, 4000},
                                    { 15, 5000},
                            },
                            oper: ">", fitlerVal: "10",
                            expectNum: 5000,
                            propName: "PropInt");
        }

        [Test]
        public void ShouldReturnProperResultForFilterByGreaterThanOrEqualForInt()
        {
            this.TestFilterComparables(
                            new Dictionary<int, int>()
                            {
                                    { 5, 3000},
                                    { 10, 4000},
                                    { 15, 5000},
                            },
                            oper: ">=", fitlerVal: "10",
                            expectNum: 9000,
                            propName: "PropInt");
        }

        [Test]
        public void ShouldReturnProperResultForEqualForInt()
        {
            this.TestFilterComparables(
                            new Dictionary<int, int>()
                            {
                                    { 5, 3000},
                                    { 10, 4000},
                                    { 15, 5000},
                            },
                            oper: "=", fitlerVal: "10",
                            expectNum: 4000,
                            propName: "PropInt");
        }

        [Test]
        public void ShouldReturnProperResultForRangeForInt()
        {
            var data = new List<DataObject>();
            var prop = typeof(DataObject).GetProperty("PropInt");
            var rnd = new Random();
            for (int i = 0; i < 5000; i++)
            {
                var newObj = new DataObject() { PropInt = rnd.Next(0, 5000) };
                data.Add(newObj);
            }

            data = data.OrderBy(x => rnd.Next()).ToList();

            var filterProvider = new FilterProvider();
            var filters = new List<KeyValuePair<string, FilterRequestModel>>()
            {
                new KeyValuePair<string, FilterRequestModel>( "PropInt", new FilterRequestModel {Operator = ">" , Value = "300" }),
                new KeyValuePair<string, FilterRequestModel>( "PropInt", new FilterRequestModel {Operator = "<" , Value = "700" }),
            };

            var filteredCollection = filterProvider.FilterData(typeof(DataObject), data.AsQueryable(), filters);

            foreach (DataObject item in filteredCollection)
            {
                Assert.IsTrue(300 < item.PropInt && item.PropInt < 700);
            }
        }

        [Test]
        public void ShouldReturnProperResultForCaseInsensitiveForString()
        {
            this.TestFilterComparables(
                            new Dictionary<string, int>()
                            {
                                    { "test", 3000},
                                    { "TeSt", 4000},
                                    { "somethingElse", 5000},
                            },
                            oper: "ci", fitlerVal: "test",
                            expectNum: 7000,
                            propName: "PropString");
        }

        [Test]
        public void ShouldReturnProperResultForCaseSensitiveForString()
        {
            this.TestFilterComparables(
                            new Dictionary<string, int>()
                            {
                                    { "test", 3000},
                                    { "TeSt", 4000},
                                    { "somethingElse", 5000},
                            },
                            oper: "cs", fitlerVal: "test",
                            expectNum: 3000,
                            propName: "PropString");
        }

        public void TestFilterComparables<T>(Dictionary<T, int> valueNumberDict, string oper, string fitlerVal, int expectNum, string propName)
        {
            var data = new List<DataObject>();
            var prop = typeof(DataObject).GetProperty(propName);
            foreach (var valueNum in valueNumberDict)
            {
                for (int i = 0; i < valueNum.Value; i++)
                {
                    var newObj = new DataObject();
                    prop.SetValue(newObj, valueNum.Key);
                    data.Add(newObj);
                }
            }

            var rnd = new Random();
            data = data.OrderBy(x => rnd.Next()).ToList();

            var filterProvider = new FilterProvider();
            var filters = new Dictionary<string, FilterRequestModel>()
            {
                { propName, new FilterRequestModel {Operator = oper , Value = fitlerVal} },
            };

            var filteredCollection = filterProvider.FilterData(typeof(DataObject), data.AsQueryable(), filters);

            Assert.AreEqual(expectNum, filteredCollection.Count());
        }
    }
}
