using Moq;
using System.Globalization;
using System.Web.Mvc;
using Server.Controllers;

namespace UnitTests.Mocks.ActionExecutedContext
{
    public static class ActionExecutedContextMocks
    {
        public static System.Web.Mvc.ActionExecutedContext GetActionExecutedContextMock(string returnValue)
        {
            var valueProvider = new Mock<IValueProvider>();
            valueProvider
                .Setup<ValueProviderResult>(x => x.GetValue(It.IsAny<string>()))
                .Returns(new ValueProviderResult(It.IsAny<string>(), returnValue, CultureInfo.CurrentCulture));

            var controller = new HomeController();
            controller.ValueProvider = valueProvider.Object;

            var filterContext = new System.Web.Mvc.ActionExecutedContext();
            filterContext.Controller = controller;

            return filterContext;
        }

        /// <summary>
        /// Returns null for any provided parameter name
        /// </summary>
        /// <returns></returns>
        public static System.Web.Mvc.ActionExecutedContext GetActionExecutedContextMockNullResult()
        {
            var valueProvider = new Mock<IValueProvider>();
            valueProvider
                .Setup<ValueProviderResult>(x => x.GetValue(It.IsAny<string>()))
                .Returns<ValueProviderResult>(null);

            var controller = new HomeController();
            controller.ValueProvider = valueProvider.Object;

            var filterContext = new System.Web.Mvc.ActionExecutedContext();
            filterContext.Controller = controller;

            return filterContext;
        }

    }
}
