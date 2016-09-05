namespace Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Diagnostics;
    using System.Linq;

    public sealed class Configuration : DbMigrationsConfiguration<Data.ApplicationDbContext>
    {
        private const int NumberOfEmployees = 500000;

        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(Data.ApplicationDbContext context)
        {
            context.Configuration.ValidateOnSaveEnabled = false;
            context.Configuration.AutoDetectChangesEnabled = false;

            if (!context.Employees.Any())
            {
                var counter = 0;
                var firstNames = RandomGen.Gen.Random.Names.First();
                var lastNames = RandomGen.Gen.Random.Names.Surname();
                var cities = RandomGen.Gen.Random.Text.Words();
                var salaries = RandomGen.Gen.Random.Numbers.Integers(100, 1000);
                var dates = RandomGen.Gen.Random.Time.Dates(new DateTime(2000, 1, 1), new DateTime(2016, 1, 1));

                for (int cityNum = 0; cityNum < 10; cityNum++)
                {
                    var city = cities();
                    for (int i = 0; i < NumberOfEmployees / 10; i++)
                    {
                        counter++;
                        context.Employees.Add(new Employee
                        {
                            FirstName = firstNames(),
                            LastName = lastNames(),
                            Occupation = city,
                            Position = cities(),
                            Salary = salaries(),
                            StartDate = dates()
                        });

                        if (counter % 1000 == 0)
                        {
                            Debug.WriteLine(counter);
                            context.SaveChanges();
                        }
                    }
                }
            }
        }
    }
}
