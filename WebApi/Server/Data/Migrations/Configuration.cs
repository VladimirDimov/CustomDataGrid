namespace Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    public sealed class Configuration : DbMigrationsConfiguration<Data.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(Data.ApplicationDbContext context)
        {
            for (int i = 0; i < 50; i++)
            {
                context.Employees.Add(new Employee
                {
                    FirstName = "Pesho",
                    LastName = "Petrov",
                    Occupation = "Sofia",
                    Position = "Asd",
                    Salary = "100",
                    StartDate = DateTime.UtcNow.ToShortDateString()
                });

                context.Employees.Add(new Employee
                {
                    FirstName = "Gosho",
                    LastName = "Goshev",
                    Occupation = "Tokio",
                    Position = "dfg",
                    Salary = "250",
                    StartDate = DateTime.UtcNow.ToShortDateString()
                });
            }

            context.SaveChanges();
        }
    }
}
