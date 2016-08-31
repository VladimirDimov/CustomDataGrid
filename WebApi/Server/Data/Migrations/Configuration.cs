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
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(Data.ApplicationDbContext context)
        {
            var firstNames = RandomGen.Gen.Random.Names.First();
            var lastNames = RandomGen.Gen.Random.Names.Surname();
            var cities = RandomGen.Gen.Random.Text.Words();
            var salaries = RandomGen.Gen.Random.Numbers.Integers(100, 1000);
            var dates = RandomGen.Gen.Random.Time.Dates(new DateTime(2000, 1, 1), new DateTime(2016, 1, 1));



            if (!context.Employees.Any())
            {
                for (int cityNum = 0; cityNum < 10; cityNum++)
                {
                    var city = cities();
                    for (int i = 0; i < 50; i++)
                    {
                        context.Employees.Add(new Employee
                        {
                            FirstName = firstNames(),
                            LastName = lastNames(),
                            Occupation = city,
                            Position = cities(),
                            Salary = salaries(),
                            StartDate = dates().ToShortDateString()
                        });
                    }
                }
            }

            context.SaveChanges();
        }
    }
}
