using Fullstack.API.Data;
using Fullstack.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fullstack.API
{
    public class InsertDummyData
    {
        public static async Task SeedDummyData(FullStackDbContext context)
        {
            if (!await context.Employees.AnyAsync())
            {
                var employees = new List<Employee>
                {
                    new Employee { Id = Guid.NewGuid(), Name = "John Smith", Email = "john.smith@company.com", Phone = 9876543210, Salary = 75000, Department = "Engineering" },
                    new Employee { Id = Guid.NewGuid(), Name = "Sarah Johnson", Email = "sarah.j@company.com", Phone = 9876543211, Salary = 82000, Department = "Marketing" },
                    new Employee { Id = Guid.NewGuid(), Name = "Michael Brown", Email = "michael.b@company.com", Phone = 9876543212, Salary = 68000, Department = "Sales" },
                    new Employee { Id = Guid.NewGuid(), Name = "Emily Davis", Email = "emily.d@company.com", Phone = 9876543213, Salary = 90000, Department = "Engineering" },
                    new Employee { Id = Guid.NewGuid(), Name = "David Wilson", Email = "david.w@company.com", Phone = 9876543214, Salary = 78000, Department = "HR" },
                    new Employee { Id = Guid.NewGuid(), Name = "Lisa Anderson", Email = "lisa.a@company.com", Phone = 9876543215, Salary = 85000, Department = "Finance" },
                    new Employee { Id = Guid.NewGuid(), Name = "Robert Taylor", Email = "robert.t@company.com", Phone = 9876543216, Salary = 72000, Department = "Sales" },
                    new Employee { Id = Guid.NewGuid(), Name = "Jennifer Martinez", Email = "jennifer.m@company.com", Phone = 9876543217, Salary = 95000, Department = "Engineering" },
                    new Employee { Id = Guid.NewGuid(), Name = "William Thomas", Email = "william.t@company.com", Phone = 9876543218, Salary = 88000, Department = "Marketing" },
                    new Employee { Id = Guid.NewGuid(), Name = "Elizabeth White", Email = "elizabeth.w@company.com", Phone = 9876543219, Salary = 92000, Department = "Finance" }
                };

                await context.Employees.AddRangeAsync(employees);
                await context.SaveChangesAsync();
                
                Console.WriteLine("Added 10 employee records to the database");
            }
            else
            {
                Console.WriteLine("Database already has employee records");
            }
        }
    }
} 