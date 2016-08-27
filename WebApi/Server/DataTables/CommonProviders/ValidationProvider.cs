using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTables.CommonProviders
{
    class ValidationProvider
    {
        public void ValidateMustNotBeNull(object obj)
        {
            if (obj == null)
            {
                throw new ArgumentNullException($"Invalid null value of type {obj.GetType().TypeInitializer.Name}.");
            }
        }
    }
}
