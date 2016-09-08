namespace Server.Controllers
{
    using Data;
    using DataTables;
    using System.Linq;
    using System.Web.Http.Cors;
    using System.Web.Mvc;

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HomeController : Controller
    {
        [DataTable]
        public ActionResult IndexDb()
        {
            var dbContext = new ApplicationDbContext();
            IOrderedQueryable<Employee> employees = dbContext
                                                    .Employees
                                                    .OrderBy(x => x.Id);

            return View("Index", employees);
        }
    }

    public class Person
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Position { get; set; }

        public string Occupation { get; set; }

        public string StartDate { get; set; }

        public string Salary { get; set; }
    }
}
