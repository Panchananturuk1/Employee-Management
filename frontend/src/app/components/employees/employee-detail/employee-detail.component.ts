import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  employee?: Employee;
  isLoading = true;
  loadFailed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeesService: EmployeesService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get initials(): string {
    return (this.employee?.name || '')
      .split(' ')
      .filter(part => part.length > 0)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (!id) {
          this.isLoading = false;
          this.loadFailed = true;
          return;
        }

        this.employeesService.getEmployee(id)
          .subscribe({
            next: (employee) => {
              this.employee = employee;
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.loadFailed = true;
            }
          });
      }
    });
  }

  deleteEmployee(): void {
    if (!this.employee) {
      return;
    }

    const name = this.employee.name;

    this.employeesService.deleteEmployee(this.employee.id)
      .subscribe({
        next: () => {
          this.toastService.success(`${name} was removed.`);
          this.router.navigate(['employees']);
        },
        error: () => this.toastService.error(`Could not delete ${name}. Please try again.`)
      });
  }
}
