import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ToastService } from 'src/app/services/toast.service';

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
export class EmployeesListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedDepartment: string = 'All';
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  departmentChart: any;
  isLoading = true;

  currentPage = 1;
  pageSize = 8;
  pageSizeOptions = [5, 8, 15, 25];

  employeePendingDelete?: Employee;

  private employeesSubscription?: Subscription;
  private themeSubscription?: Subscription;

  constructor(
    private employeesService: EmployeesService,
    private authService: AuthService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) { }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
  }

  get pagedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get rangeStart(): number {
    return this.filteredEmployees.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }

  ngOnInit(): void {
    this.loadEmployees();

    // Chart.js paints its labels onto a canvas, so it has to be redrawn on a theme change.
    this.themeSubscription = this.themeService.theme$.subscribe({
      next: () => this.initChart()
    });
  }

  ngOnDestroy(): void {
    this.employeesSubscription?.unsubscribe();
    this.themeSubscription?.unsubscribe();

    if (this.departmentChart) {
      this.departmentChart.destroy();
    }
  }

  loadEmployees(): void {
    this.employeesSubscription = this.employeesService.streamEmployees()
      .subscribe({
        next: (employees) => {
          this.employees = employees;
          this.isLoading = false;
          this.applyFilters();
          setTimeout(() => this.initChart(), 500); // Delay to ensure DOM is ready
        },
        error: (response) => {
          this.isLoading = false;
          this.toastService.error('Could not load employees. Please refresh and try again.');
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

      const labelColor = this.themeService.isDark ? '#e4e6eb' : '#666666';
      
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
                color: labelColor,
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: 'Employee Distribution by Department',
              color: labelColor,
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

  calculateTotalPayroll(): number {
    return this.employees.reduce((sum, emp) => sum + emp.salary, 0);
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
    this.clampCurrentPage();
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
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  changePageSize(size: number): void {
    this.pageSize = Number(size);
    this.currentPage = 1;
  }

  confirmDelete(employee: Employee): void {
    this.employeePendingDelete = employee;
  }

  deletePendingEmployee(): void {
    const employee = this.employeePendingDelete;

    if (!employee) {
      return;
    }

    this.employeesService.deleteEmployee(employee.id)
      .subscribe({
        next: () => {
          this.toastService.success(`${employee.name} was removed.`);
          this.employeePendingDelete = undefined;
        },
        error: () => this.toastService.error(`Could not delete ${employee.name}. Please try again.`)
      });
  }

  exportToCsv(): void {
    if (this.filteredEmployees.length === 0) {
      this.toastService.info('There are no employees to export.');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Salary', 'Department'];
    const rows = this.filteredEmployees.map(emp =>
      [emp.name, emp.email, emp.phone, emp.salary, emp.department]
        .map(value => this.escapeCsvValue(value))
        .join(',')
    );

    // The BOM keeps Excel from mangling non-ASCII names.
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));

    const link = document.createElement('a');
    link.href = url;
    link.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    this.toastService.success(`Exported ${this.filteredEmployees.length} employees to CSV.`);
  }

  printReport(): void {
    window.print();
  }

  private clampCurrentPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  private escapeCsvValue(value: string | number): string {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }
}
