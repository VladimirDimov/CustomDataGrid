namespace DataTables.Expressions
{
    using System.Linq.Expressions;

    interface ICreateExpression
    {
        LambdaExpression LambdaExpression();
    }
}
