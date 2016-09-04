#Data Table With Ajax Serversde Processing For.NET MVC
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
		            <th data-name="FirstName">First Name</th>
		            <th data-name="LastName">Last Name</th>
		            <th data-name="Position">Position</th>
		            <th data-name="Occupation">Occupation</th>
		            <th data-name="StartDate">Start Date</th>
		            <th data-name="Salary">Salary</th>
		            <th data-name="Actions">Actions</th>
		        </tr>
		    </thead>
		    <tbody>
		    </tbody>
		</table>

#####JS
	var myTable = dataTable.init('#table', {
	    ajax: {
	        url: 'http://localhost:65219/home/indexDB'
	    },
	});

##Features
###Selectable
######example:
	var myTable = dataTable.init('#table', {

		...
	
	    features: {
			// The property name that identifies the object
	        identifier: 'Id',
	        selectable: {
				// a custom class may be added to the selected rows
	            cssClasses: 'success'
	        }
	    }
	});

The selected rows identifiers can be get by:

	myTable.getSelected();

The result is an array of the identifiers of the selected rows.

###Sort
Just put an attribute "sortable" in the column < th > element.
######example:
    <table id="table">
        <thead>
            <tr>
                <th data-name="FirstName" sortable>First Name</th>
                <th data-name="LastName" sortable>Last Name</th>
				...
                <th data-name="StartDate" sortable>Start Date</th>
                <th data-name="Salary" sortable>Salary</th>
                ...
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>

###Filters
The filters can be created by placing input elements anywhere in the table. The inputs require an attribute filter="..." with any of the available options (see the list of available filter options) and attribute data-columnNames containing the names of the columns over which the filtering will be performed separated by a single space. All filters can be applied together in any combinations.

#####example

	// This will perform a case insensitive filtering. 
	// As a result all the elements with a property FirstName containing the
	// porvided string will be returned.
	<input type="text" data-columnNames="FirstName" filter="ci" class="form-control">

	// This will perform a case insensitive filtering. 
	// As a result all the elements with properties FirstName or LastName equal to the
	// porvided string will be returned.
	<input type="text" data-columnNames="FirstName LastName" filter="=" class="form-control">

#####List of available filter options
- "ci" - contains (case insensitive);
- "=" - exact match(case insensitive);
- ">" - greater than;
- ">=" - greater than or equal;
- "<" - less than;
- "<=" - less than or equal;
- "si" - starts with (case insensitive);
- "ei" - ends with (case insensitive);

 