using Fullstack.API.Data;
using Fullstack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Fullstack.API.Controllers
{
   // [EnableCors]
   // [Authorize]
   // [Produces("application/json")]
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : Controller
    {
        private readonly FullStackDbContext _fullStackDbContext;

        public EmployeesController(FullStackDbContext fullStackDbContext)
        {
            this._fullStackDbContext = fullStackDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _fullStackDbContext.Employees.ToListAsync();
            return Ok(employees);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployees([FromBody] Employee employeeReequest)
        {
            employeeReequest.Id = Guid.NewGuid();

            await _fullStackDbContext.Employees.AddAsync(employeeReequest);
            await _fullStackDbContext.SaveChangesAsync();

            return Ok(employeeReequest);

        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetEmployee([FromRoute] Guid id)
        {
            var employee = await _fullStackDbContext.Employees.FirstOrDefaultAsync(x => x.Id == id);

            if(employee == null)
            { 
              return NotFound();    
            }
            return Ok(employee);
        }


        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateEmployee([FromRoute] Guid id, Employee updateEmployeeRequest)
      // public async Task<ActionResult<List<Employee>>> UpdateEmployee(Employee updateEmployeeRequest)

        {
              var employee = await _fullStackDbContext.Employees.FindAsync(id);
           //   var employee = await _fullStackDbContext.Employees.FindAsync(updateEmployeeRequest.Id);

            if (employee == null)
            {
                return NotFound();
            }

            employee.Name = updateEmployeeRequest.Name;
            employee.Email = updateEmployeeRequest.Email;
            employee.Salary = updateEmployeeRequest.Salary;
            employee.Phone = updateEmployeeRequest.Phone;
            employee.Department = updateEmployeeRequest.Department;


            await _fullStackDbContext.SaveChangesAsync();
            return Ok(employee);
          // return Ok(await _fullStackDbContext.Employees.ToListAsync());

        }


        [HttpDelete]
        [Route("{id:Guid}")]
        // [Route("deleteAllWithIds")]
        public async Task<IActionResult> DeleteEmployee([FromRoute] Guid id)
        {

            

            var employee = await _fullStackDbContext.Employees.FindAsync(id);

            if (employee == null)
            {
                 return NotFound(id);
            }

            _fullStackDbContext.Employees.Remove(employee);
            await _fullStackDbContext.SaveChangesAsync();   

            return Ok(employee);

        }

    }
}
