import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { EmployeesService } from 'src/app/services/employees.service';

// Create an interface for Chart from the global Chart.js library
declare global {
  interface Window {
    Chart: any;
  }
}

interface DepartmentCounts {
  [key: string]: number;
}

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedDepartment: string = 'All';
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  departmentChart: any;

  constructor(private employeesService: EmployeesService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeesService.getAllEmployees()
      .subscribe({
        next: (employees) => {
          this.employees = employees;
          this.filteredEmployees = [...employees];
          setTimeout(() => this.initChart(), 500); // Delay to ensure DOM is ready
        },
        error: (response) => {
          console.log(response);
        }
      });
  }

  initChart(): void {
    // Make sure employees are loaded and the DOM element exists
    if (this.employees.length > 0 && document.getElementById('departmentChart')) {
      // Get department counts
      const departments = this.getUniqueDepartments();
      const counts = departments.map(dept => 
        this.employees.filter(emp => emp.department === dept).length
      );
      
      // Generate colors for each department
      const backgroundColors = [
        'rgba(54, 162, 235, 0.7)', // blue
        'rgba(255, 99, 132, 0.7)',  // red
        'rgba(75, 192, 192, 0.7)',  // green
        'rgba(255, 206, 86, 0.7)',  // yellow
        'rgba(153, 102, 255, 0.7)'  // purple
      ];

      // Create the chart using the global Chart.js library
      const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
      if (this.departmentChart) {
        this.departmentChart.destroy();
      }
      
      this.departmentChart = new window.Chart(ctx, {
        type: 'pie',
        data: {
          labels: departments,
          datasets: [{
            label: 'Employees by Department',
            data: counts,
            backgroundColor: backgroundColors.slice(0, departments.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: 'Employee Distribution by Department',
              font: {
                size: 14
              }
            }
          }
        }
      });
    }
  }

  getUniqueDepartments(): string[] {
    const departments = [...new Set(this.employees.map(emp => emp.department))];
    return departments.filter(dept => dept); // Remove empty values
  }

  calculateAverageSalary(): number {
    if (this.employees.length === 0) return 0;
    const total = this.employees.reduce((sum, emp) => sum + emp.salary, 0);
    return Math.round(total / this.employees.length);
  }

  getTopDepartment(): string {
    if (this.employees.length === 0) return 'None';
    
    const deptCounts: DepartmentCounts = {};
    this.employees.forEach(emp => {
      deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    });
    
    let topDept = '';
    let maxCount = 0;
    
    Object.keys(deptCounts).forEach(dept => {
      if (deptCounts[dept] > maxCount) {
        maxCount = deptCounts[dept];
        topDept = dept;
      }
    });
    
    return topDept;
  }

  filterByDepartment(department: string): void {
    this.selectedDepartment = department;
    this.applyFilters();
  }

  applySearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.employees];
    
    // Apply department filter
    if (this.selectedDepartment !== 'All') {
      filtered = filtered.filter(emp => emp.department === this.selectedDepartment);
    }
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.department.toLowerCase().includes(search) ||
        emp.phone.toString().includes(search) ||
        emp.salary.toString().includes(search)
      );
    }
    
    // Apply sorting
    if (this.sortColumn) {
      this.sortData(filtered);
    }
    
    this.filteredEmployees = filtered;
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }

  sortData(data: Employee[]): void {
    data.sort((a: any, b: any) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];
      
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      
      if (valA < valB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  resetFilters(): void {
    this.selectedDepartment = 'All';
    this.searchTerm = '';
    this.sortColumn = '';
    this.filteredEmployees = [...this.employees];
  }
}
