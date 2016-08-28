namespace UnitTests.LambdaExpressions
{
    using DataTables.Expressions;
    using Mocks.DataObjects;
    using NUnit.Framework;
    using System;
    using System.Linq.Expressions;

    class OrderByLambdaTests
    {
        [Test]
        public void ShouldThrowOfTypeIfNoCollectionGenericTypeIsProvided()
        {
            Assert.Throws(typeof(ArgumentNullException), () =>
            {
                OrderByLambda.LambdaExpression(null, "PropName", true);
            });
        }

        [Test]
        public void ShouldThrowOfTypeIfPropNameIsNullOrEmpty()
        {
            Assert.Throws(typeof(ArgumentException), () =>
            {
                OrderByLambda.LambdaExpression(typeof(object), "", true);
            });

            Assert.Throws(typeof(ArgumentException), () =>
            {
                OrderByLambda.LambdaExpression(typeof(object), null, true);
            });
        }

        [Test]
        public void ShouldThrowOfTypeIfPropNameIsNotAvailable()
        {
            Assert.Throws(typeof(ArgumentException), () =>
            {
                OrderByLambda.LambdaExpression(typeof(object), "InvalidPropName_skjcasdvkdjs", true);
            });
        }

        [Test]
        public void OrderByLambdaShouldReturnPropperValueIfIsAscending()
        {
            var lambda = OrderByLambda.LambdaExpression(typeof(DataObject), "PropString", true);
            var body = (MethodCallExpression)lambda.Body;
            var methodName = body.Method.Name;
            var orderByBody = body.Method.GetParameters();

            Assert.AreEqual("OrderBy", methodName);
        }

        [Test]
        public void OrderByLambdaShouldReturnPropperValueIfIsDescending()
        {
            var lambda = OrderByLambda.LambdaExpression(typeof(DataObject), "PropString", false);
            var body = (MethodCallExpression)lambda.Body;
            var methodName = body.Method.Name;
            var orderByBody = body.Method.GetParameters();

            Assert.AreEqual("OrderByDescending", methodName);
        }
    }
}
