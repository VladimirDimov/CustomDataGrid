using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using DataTables.CommonProviders.Contracts;
using DataTables.ProcessDataProviders;
using Moq;
using NUnit.Framework;

namespace UnitTests.Tests.ProcessDataProviers
{
    public class RequestParamsManagerTests
    {
        [Test]
        public void ShouldThrowOfTypeIfPageSizeIsMissing()
        {
            ShouldThrowOfTypeIfParameterIsMissing("pageSize");
        }

        [Test]
        public void ShouldThrowOfTypeIfPageIsMissing()
        {
            ShouldThrowOfTypeIfParameterIsMissing("page");
        }

        [Test]
        public void ShouldThrowOfTypeIfAscIsMissing()
        {
            ShouldThrowOfTypeIfParameterIsMissing("asc");
        }

        [Test]
        public void ShouldThrowOfTypeIfGetIdentifiersStringIsMissing()
        {
            ShouldThrowOfTypeIfParameterIsMissing("getIdentifiers");
        }

        [Test]
        public void ShouldNotThrowIfOnlyRequiredParamsAreProvided()
        {
            // Setup the IHttpContextHelpers Mock
            var context = GetActionExecutedContext(GetValueProviderWithNonNullFilterMock());
            var httpContextHelpersMock = GetHttpHelpersMock(context);
            // Setup the IJsonProvider Mock
            var jsonProviderMock = new Mock<IJsonProvider>();

            var requestParamsManager = new RequestParamsManager(jsonProviderMock.Object, httpContextHelpersMock.Object);

            Assert.DoesNotThrow(() =>
            {
                requestParamsManager.GetRequestModel(context);
            });
        }

        [Test]
        public void ShouldNotThrowIfNoFilterValueIsProvided()
        {
            // Setup the IHttpContextHelpers Mock
            var context = GetActionExecutedContext(GetValueProviderWithNullFilterMock());
            var httpContextHelpersMock = GetHttpHelpersMock(context);
            // Setup the IJsonProvider Mock
            var jsonProviderMock = new Mock<IJsonProvider>();

            var requestParamsManager = new RequestParamsManager(jsonProviderMock.Object, httpContextHelpersMock.Object);

            Assert.DoesNotThrow(() =>
            {
                requestParamsManager.GetRequestModel(context);
            });
        }

        private void ShouldThrowOfTypeIfParameterIsMissing(string paramName)
        {
            // Setup the IHttpContextHelpers Mock
            var context = GetActionExecutedContext(GetValueProviderWithNonNullFilterMock());
            var httpContextHelpersMock = GetHttpHelpersMock(context);

            httpContextHelpersMock.Setup(x => x.GetRequestParameter(paramName, context)).Returns<string>(null);

            // Setup the IJsonProvider Mock
            var jsonProviderMock = new Mock<IJsonProvider>();

            var requestParamsManager = new RequestParamsManager(jsonProviderMock.Object, httpContextHelpersMock.Object);

            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                requestParamsManager.GetRequestModel(context);
            });
        }

        Mock<IHttpContextHelpers> GetHttpHelpersMock(ActionExecutedContext actionExecutedContext)
        {
            var httpContextHelpersMock = new Mock<IHttpContextHelpers>();
            // pageSize-page-orderBy-asc-identifierPropName-isGetIdentifiers
            httpContextHelpersMock.SetupSequence(m => m.GetRequestParameter(It.IsAny<string>(), actionExecutedContext))
                .Returns("20")
                .Returns("1")
                .Returns("false")
                .Returns("true");

            return httpContextHelpersMock;
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
    }

    public class TestController : Controller
    {
    }
}
