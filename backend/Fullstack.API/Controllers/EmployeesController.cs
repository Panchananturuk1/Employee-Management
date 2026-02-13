using Fullstack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;

namespace Fullstack.API.Controllers
{
   // [EnableCors]
   // [Authorize]
   // [Produces("application/json")]
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : Controller
    {
        private readonly FirestoreDb _firestoreDb;

        public EmployeesController(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var snapshot = await _firestoreDb.Collection("employees").GetSnapshotAsync();
            var employees = snapshot.Documents.Select(doc =>
            {
                var data = doc.ToDictionary();
                return new Employee
                {
                    Id = doc.Id,
                    Name = data.ContainsKey("name") ? data["name"]?.ToString() : string.Empty,
                    Email = data.ContainsKey("email") ? data["email"]?.ToString() : string.Empty,
                    Phone = data.ContainsKey("phone") ? Convert.ToInt64(data["phone"]) : 0,
                    Salary = data.ContainsKey("salary") ? Convert.ToInt64(data["salary"]) : 0,
                    Department = data.ContainsKey("department") ? data["department"]?.ToString() : string.Empty
                };
            }).ToList();

            return Ok(employees);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployees([FromBody] Employee employeeReequest)
        {
            var employeesCollection = _firestoreDb.Collection("employees");

            var employeeData = new Dictionary<string, object>
            {
                { "name", employeeReequest.Name },
                { "email", employeeReequest.Email },
                { "phone", employeeReequest.Phone },
                { "salary", employeeReequest.Salary },
                { "department", employeeReequest.Department }
            };

            var addedDoc = await employeesCollection.AddAsync(employeeData);

            var createdEmployee = new Employee
            {
                Id = addedDoc.Id,
                Name = employeeReequest.Name,
                Email = employeeReequest.Email,
                Phone = employeeReequest.Phone,
                Salary = employeeReequest.Salary,
                Department = employeeReequest.Department
            };

            return Ok(createdEmployee);

        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetEmployee([FromRoute] string id)
        {
            var docRef = _firestoreDb.Collection("employees").Document(id);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return NotFound();
            }

            var data = snapshot.ToDictionary();

            var employee = new Employee
            {
                Id = snapshot.Id,
                Name = data.ContainsKey("name") ? data["name"]?.ToString() : string.Empty,
                Email = data.ContainsKey("email") ? data["email"]?.ToString() : string.Empty,
                Phone = data.ContainsKey("phone") ? Convert.ToInt64(data["phone"]) : 0,
                Salary = data.ContainsKey("salary") ? Convert.ToInt64(data["salary"]) : 0,
                Department = data.ContainsKey("department") ? data["department"]?.ToString() : string.Empty
            };

            return Ok(employee);
        }


        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateEmployee([FromRoute] string id, Employee updateEmployeeRequest)
      // public async Task<ActionResult<List<Employee>>> UpdateEmployee(Employee updateEmployeeRequest)

        {
            var docRef = _firestoreDb.Collection("employees").Document(id);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return NotFound();
            }

            var updatedData = new Dictionary<string, object>
            {
                { "name", updateEmployeeRequest.Name },
                { "email", updateEmployeeRequest.Email },
                { "phone", updateEmployeeRequest.Phone },
                { "salary", updateEmployeeRequest.Salary },
                { "department", updateEmployeeRequest.Department }
            };

            await docRef.SetAsync(updatedData, SetOptions.Overwrite);

            var updatedEmployee = new Employee
            {
                Id = id,
                Name = updateEmployeeRequest.Name,
                Email = updateEmployeeRequest.Email,
                Phone = updateEmployeeRequest.Phone,
                Salary = updateEmployeeRequest.Salary,
                Department = updateEmployeeRequest.Department
            };

            return Ok(updatedEmployee);
          // return Ok(await _fullStackDbContext.Employees.ToListAsync());

        }


        [HttpDelete]
        [Route("{id}")]
        // [Route("deleteAllWithIds")]
        public async Task<IActionResult> DeleteEmployee([FromRoute] string id)
        {
            var docRef = _firestoreDb.Collection("employees").Document(id);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return NotFound(id);
            }

            await docRef.DeleteAsync();

            return Ok(new { id });

        }

    }
}
