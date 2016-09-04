#Data table with serversde processing for.NET MVC
This is an ajax data table with server side pagination for MVC.
This project is still in process!
##Quick Start
###Server:
 - Put [DataTable] attribute on the Action
 - Return IOrderedQueryable<>

	[DataTable]
	public ActionResult Index()
	{
		IOrderedQueryable<Employee> employees =
										this.employeesService.
										GetAll()
										OrderedBy(x => x.Id);
		
		return View(employees);
	}

	public class Employee
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Position { get; set; }

        public string Occupation { get; set; }

        public DateTime StartDate { get; set; }

        public decimal Salary { get; set; }
    }
###Client:
#####HTML
Set all column headers in the < thead >. Any column that expects result from the database should have data-name attribute value as the corresponding property name from the data class.

    <table id="table">
        <thead>
            <tr>
                <th data-name="FirstName" sortable>First Name</th>
                <th data-name="LastName" sortable>Last Name</th>
                <th data-name="Position">Position</th>
                <th data-name="Occupation" sortable>Occupation</th>
                <th data-name="StartDate" sortable>Start Date</th>
                <th data-name="Salary" sortable>Salary</th>
                <th data-name="Actions">Actions</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>

#####JS
	var tb = dataTable.init('#table', {
	    ajax: {
	        url: 'http://localhost:65219/home/indexDB'
	    },
	});
