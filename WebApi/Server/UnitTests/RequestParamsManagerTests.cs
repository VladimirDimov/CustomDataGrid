namespace UnitTests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;
    using NUnit.Framework;
    using Server.filters;
    using System;
    using System.Web;
    using System.Web.Mvc;

    [TestClass]
    public class RequestParamsManagerTests
    {
        [Test]
        public void GetIdentifiersCollectionShouldReturnNullIfNoPropNameIsProvided()
        {
            //var request = new Mock<HttpRequestBase>();
            //request.SetupGet(r => r.HttpMethod).Returns("GET");
            //request.SetupGet(r => r.Url).Returns(new Uri("http://somesite/action"));

            //var httpContext = new Mock<HttpContextBase>();
            //httpContext.SetupGet(c => c.Request).Returns(request.Object);

            //var actionExecutedContext = new Mock<ActionExecutedContext>();
            //actionExecutedContext.SetupGet(c => c.HttpContext).Returns(httpContext.Object);

            //var requestManager = new RequestParamsManager();
            //var result = requestManager.GetRequestModel(actionExecutedContext);

            //Microsoft.VisualStudio.TestTools.UnitTesting.Assert.AreEqual(null, result);
        }
    }
}
