namespace UnitTests.CommonProviders
{
    using DataTables.CommonProviders;
    using NUnit.Framework;
    using System;
    using UnitTests.Mocks.ActionExecutedContext;

    class HttpContextHelpersTests
    {
        private const string CompareStringConst = "CompareStringConst";

        [Test]
        public void GetRequestParameterOrDefaultShouldReturnNullIfNoSuchValue()
        {
            var filterContext = ActionExecutedContextMocks.GetActionExecutedContextMock(null);
            var httpContextHelpers = new HttpContextHelpers();
            var result = httpContextHelpers.GetRequestParameterOrDefault("asdsd", filterContext);

            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreEqual(null, result);
        }

        [Test]
        public void GetRequestParameterOrDefaultShouldReturnPropperValue()
        {
            var filterContext = ActionExecutedContextMocks.GetActionExecutedContextMock(CompareStringConst);
            var httpContextHelpers = new HttpContextHelpers();
            var result = httpContextHelpers.GetRequestParameterOrDefault("asdsd", filterContext);

            Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreEqual(CompareStringConst, result);
        }

        [Test]
        public void GetRequestParameterOrDefaultShouldThrowOfTypeIfNoParamArgumentIsProvided()
        {
            var filterContext = ActionExecutedContextMocks.GetActionExecutedContextMock(CompareStringConst);
            var httpContextHelpers = new HttpContextHelpers();

            Assert.Throws<ArgumentNullException>(() =>
            {
                var result = httpContextHelpers.GetRequestParameterOrDefault(null, filterContext);
            });
        }

        [Test]
        public void GetRequestParameterShouldThrowOfTypeIfParamIsNotFound()
        {
            var filterContext = ActionExecutedContextMocks.GetActionExecutedContextMock(null);
            var httpContextHelpers = new HttpContextHelpers();
            Assert.Throws<ArgumentException>(() =>
            {
                httpContextHelpers.GetRequestParameter(CompareStringConst, filterContext);
            });
        }
    }
}
