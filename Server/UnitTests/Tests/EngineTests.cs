namespace UnitTests.Tests
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using DataTables;
    using DataTables.CommonProviders;
    using DataTables.Models.Filter;
    using DataTables.Models.Request;
    using DataTables.ProcessDataProviders;
    using DataTables.ProcessDataProviders.Contracts;
    using Moq;
    using NUnit.Framework;

    public class EngineTests
    {
        [Test]
        public void RequestParamsManagerShouldCallMethodGetRequestModel()
        {
            var actionExecutedContext = GetActionExecutedContext(GetValueProviderWithNonNullFilterMock());

            var data = new List<DataObject>().AsQueryable().OrderBy(x => x);
            var requestModel = GetRequestModel();

            // Mock IRequestParamsManager
            var requestParamsManagerMock = new Mock<IRequestParamsManager>();
            requestParamsManagerMock.Setup(x => x.GetRequestModel(actionExecutedContext)).Returns(requestModel);

            // Mock IFilterProvider
            var processDataMock = new Mock<IProcessData>();
            processDataMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns(data);

            // Mock GetIdentifiersProvider
            var getIdentifiersProviderMock = new Mock<IGetIdentifiersProvider>();
            getIdentifiersProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns<IQueryable>(null);

            var engine = new Engine(
                                    requestParamsManagerMock.Object,
                                    processDataMock.Object,
                                    processDataMock.Object,
                                    getIdentifiersProviderMock.Object,
                                    new JsonProvider());


            engine.Run(actionExecutedContext);
            requestParamsManagerMock.Verify(x => x.GetRequestModel(actionExecutedContext));
        }

        [Test]
        public void FilterProviderShouldCallMethodExecute()
        {
            var actionExecutedContext = GetActionExecutedContext(GetValueProviderWithNonNullFilterMock());

            var data = new List<DataObject>().AsQueryable().OrderBy(x => x);
            var dataType = typeof(DataObject);
            var requestModel = GetRequestModel();

            // Mock IRequestParamsManager
            var requestParamsManagerMock = new Mock<IRequestParamsManager>();
            requestParamsManagerMock.Setup(x => x.GetRequestModel(actionExecutedContext)).Returns(requestModel);

            // Mock IFilterProvider
            var filterProviderMock = new Mock<IProcessData>();
            filterProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns(data);
            var sortProviderMock = new Mock<IProcessData>();
            sortProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns(data);

            // Mock GetIdentifiersProvider
            var getIdentifiersProviderMock = new Mock<IGetIdentifiersProvider>();
            getIdentifiersProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns<IQueryable>(null);

            var engine = new Engine(
                                    requestParamsManagerMock.Object,
                                    filterProviderMock.Object,
                                    sortProviderMock.Object,
                                    getIdentifiersProviderMock.Object,
                                    new JsonProvider());


            engine.Run(actionExecutedContext);

            filterProviderMock.Verify(x => x.Execute(data, requestModel, dataType));
        }

        [Test]
        public void SortProviderShouldCallMethodExecute()
        {
            var actionExecutedContext = GetActionExecutedContext(GetValueProviderWithNonNullFilterMock());

            var data = new List<DataObject>().AsQueryable().OrderBy(x => x);
            var dataType = typeof(DataObject);
            var requestModel = GetRequestModel();

            // Mock IRequestParamsManager
            var requestParamsManagerMock = new Mock<IRequestParamsManager>();
            requestParamsManagerMock.Setup(x => x.GetRequestModel(actionExecutedContext)).Returns(requestModel);

            // Mock IFilterProvider
            var filterProviderMock = new Mock<IProcessData>();
            filterProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns(data);
            var sortProviderMock = new Mock<IProcessData>();
            sortProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns(data);

            // Mock GetIdentifiersProvider
            var getIdentifiersProviderMock = new Mock<IGetIdentifiersProvider>();
            getIdentifiersProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns<IQueryable>(null);

            var engine = new Engine(
                                    requestParamsManagerMock.Object,
                                    filterProviderMock.Object,
                                    sortProviderMock.Object,
                                    getIdentifiersProviderMock.Object,
                                    new JsonProvider());


            engine.Run(actionExecutedContext);

            sortProviderMock.Verify(x => x.Execute(data, requestModel, dataType));
        }

        [Test]
        public void GetIdentifiersProviderProviderShouldCallMethodExecute()
        {
            var actionExecutedContext = GetActionExecutedContext(GetValueProviderWithNonNullFilterMock());

            var data = new List<DataObject>().AsQueryable().OrderBy(x => x);
            var dataType = typeof(DataObject);
            var requestModel = GetRequestModel();

            // Mock IRequestParamsManager
            var requestParamsManagerMock = new Mock<IRequestParamsManager>();
            requestParamsManagerMock.Setup(x => x.GetRequestModel(actionExecutedContext)).Returns(requestModel);

            // Mock IFilterProvider
            var filterProviderMock = new Mock<IProcessData>();
            filterProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns(data);
            var sortProviderMock = new Mock<IProcessData>();
            sortProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns(data);

            // Mock GetIdentifiersProvider
            var getIdentifiersProviderMock = new Mock<IGetIdentifiersProvider>();
            getIdentifiersProviderMock.Setup(x => x.Execute(data, requestModel, typeof(DataObject))).Returns<IQueryable>(null);

            var engine = new Engine(
                                    requestParamsManagerMock.Object,
                                    filterProviderMock.Object,
                                    sortProviderMock.Object,
                                    getIdentifiersProviderMock.Object,
                                    new JsonProvider());


            engine.Run(actionExecutedContext);

            getIdentifiersProviderMock.Verify(x => x.Execute(data, requestModel, dataType));
        }

        private RequestModel GetRequestModel()
        {
            var requestModel = new RequestModel()
            {
                Data = new List<DataObject>().AsQueryable().OrderBy(x => x),
                Filter = new List<KeyValuePair<string, FilterRequestModel>>(),
                PageSize = 20,
                Page = 1,
                GetIdentifiers = true,
                IdentifierPropName = "PropString",
                IsAscending = true,
                OrderByPropName = "PropString"
            };

            return requestModel;
        }

        private ActionExecutedContext GetActionExecutedContext(Mock<IValueProvider> valueProviderMock)
        {
            // context <- controllerBase <- valueProvider
            var controller = new TestController();
            controller.ValueProvider = valueProviderMock.Object;

            return new ActionExecutedContext() { Controller = controller };
        }

        private Mock<IValueProvider> GetValueProviderWithNonNullFilterMock()
        {
            var valueProviderMock = new Mock<IValueProvider>();

            valueProviderMock
                .Setup(x => x.GetValue("filter"))
                .Returns(new ValueProviderResult(null, It.IsAny<string>(), System.Globalization.CultureInfo.InvariantCulture));

            return valueProviderMock;
        }

        private Mock<IValueProvider> GetValueProviderWithNullFilterMock()
        {
            var valueProviderMock = new Mock<IValueProvider>();

            valueProviderMock
                .Setup(x => x.GetValue("filter"))
                .Returns<ValueProviderResult>(null);

            return valueProviderMock;
        }

        class TestController : Controller
        {
        }

        class DataObject
        {
            public string PropString { get; set; }
        }
    }
}
