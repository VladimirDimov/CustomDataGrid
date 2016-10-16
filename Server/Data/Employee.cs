namespace Data
{
    using System;
    using System.Collections.Generic;

    public class Employee
    {
        public Employee()
        {
            this.Notes = new HashSet<Note>();
        }

        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Position { get; set; }

        public string Occupation { get; set; }

        public DateTime StartDate { get; set; }

        public decimal Salary { get; set; }

        public virtual ICollection<Note> Notes { get; set; }
    }
}