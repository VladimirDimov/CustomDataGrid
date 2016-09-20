#Data Table With Ajax Serversde Processing For.NET MVC

----------

##Description
A simple data table. Uses Bootstrap styles. Supports paging, filtering, sorting and multiselect with server side processing.
**This project is still under development!**

##Installation
From the package manager console in Visual Studio type `Install-Package DataTableServerSide`. On the client side reference the `dataTablesServerSide.js` from the `assets/datatableServerside` folder. Also add the `bootstrap-tables.css` ([http://bootstrap-table.wenzhixin.net.cn/](http://bootstrap-table.wenzhixin.net.cn/ "link")).

##Quick Start
###Server:
 - Put [DataTable] attribute on the Action
 - Return IOrderedQueryable<>
```cs
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
```
###Client:
#####HTML
Set all column headers in the `<thead>`. Any column that expects result from the database should have data-name attribute value as the corresponding property name from the data class.

```html
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
```
#####JS
```javascript
var myTable = dataTable.init('#table', {
    ajax: {
        url: 'http://localhost:65219/home/indexDB'
    },
});
```
##Features
###Selectable
######example:
```javascript
var myTable = dataTable.init('#table', {

	...

    features: {
		// The property name that identifies the object
        identifier: 'Id',
        selectable: {
			// By default this option is set to true. Use it to disable the selectable option
			enable: true,
			// Enable/disable rows multiselect. By default it is set to false
			multi: true,
			// a custom class may be added to the selected rows
            cssClasses: 'success'
        }
    }
});
```
The selected rows identifiers can be got by:

	myTable.getSelected();

The result is an array of the identifiers of the selected rows.

###Sort
Just put an attribute "sortable" in the column `<th>` element.
######example:
```html
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
```

###Filters
The filters can be created by placing input elements anywhere in the table. The inputs require an attribute filter="..." with any of the available options (see the list of available filter options) and attribute `data-columnNames` containing the names of the columns over which the filtering will be performed separated by a single space. All filters can be applied together in any combinations.

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

###Custom Column Rendering

#####example:
Add 'columns' property in the 'settings' object. For each column that you want to make a custom rendering add a property with the column name and inside create a property with a value equal to a function that accepts a single argument equal to the cell value. Return the rendered value;
```javascript
var myTable = dataTable.init('#table', {
	...
    columns: {
        Salary: {
            render: function (content) {
                return content + ' $';
            }
        },

        Actions: {
            render: function () {
                return '<button class="btn-edit">Edit</button>' +
                    '<button class="btn-save">Save</button>';
            }
        },

        StartDate: {
            render: function (content) {
                var formattedDate = formatDate(content);

                return formattedDate;
            }
        },
		
		FullName: {
            render: function (content, rowData) {	
                return rowData.FirstName + ' ' + rowData.LastName;
            }
        },
    },
	...
});
```

###Templates
You may add custom templates in the table body. Add a row with attribute `dt-template="templateName"`. Inside the `<td>` elements may be any nested elements. The elements which hold the table data must have a tag `data-name="propertyName"`. The property name can be the name of any property of the database object.
The first template which will be rendered will be the template with a name "main". If there is not such template the values will be rendered directly into the `<td>` elements.

You can switch the templates through buttons with attribute `dt-btn-template="targetTemplateName"`. Clicking the button will switch the row to template with the provided name. You can add some animation to the template switching by adding an attribute `dt-delay="timeInMilliseconds"` in the button element.

#####Example:
```html
<tbody>
    <tr dt-template="edit">
        <td>
            <input type="text" data-name="FirstName" value="" class="td-inner form-control" />
        </td>
        <td>
            <input type="text" data-name="LastName" value="" class="td-inner form-control" />
        </td>
        <td>
            <input type="text" no-custom-Render data-name="Salary" value="" class="td-inner form-control" />
        </td>
        <td>
            <button dt-btn-update="info" dt-delay="250" class="btn btn-primary">Update</button>
            <button dt-btn-template="main" dt-delay="250" class="btn btn-default">Cancel</button>
        </td>
    </tr>
    <tr dt-template="main">
        <td>
            <div data-name="Id"></div>
        </td>
        <td>
            <div data-name="FirstName"></div>
        </td>
        <td>
            <div data-name="Salary"></div>
        </td>
        <td>
            <button dt-btn-template="edit" dt-delay="250" class="btn btn-warning">Edit</button>
            <button dt-btn-template="info" dt-delay="250" class="btn btn-info">Info</button>
        </td>
    </tr>

    <tr dt-template="info">
        <td colspan="4">
            <div class="jumbotron">
                <h1><span data-name="FirstName"></span> <span data-name="LastName"></span></h1>
                <p>Salary: <span data-name="Salary" /></p>
                <p><a dt-btn-template="main" class="btn btn-primary btn-lg" href="#" role="button">Return</a></p>
            </div>
        </td>
    </tr>
</tbody>
```
