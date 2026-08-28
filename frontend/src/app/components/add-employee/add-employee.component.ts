import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  addEmployeeRequest: Employee ={
    id: '',
    name: '',
    email: '',
    phone: 0,
    salary: 0,
    department: ''
  }

  isSubmitting = false;

  constructor(private employeeService: EmployeesService, private router: Router,
    private toastService: ToastService) { }

  ngOnInit(): void {
  }

  addEmployee(){
    this.isSubmitting = true;

    this.employeeService.addEmployee(this.addEmployeeRequest)
    .subscribe({
      next: (employee) => {
        this.toastService.success(`${employee.name} was added.`);
        this.router.navigate(['employees'])
      },
      error: () => {
        this.toastService.error('Could not save the employee. Please try again.');
        this.isSubmitting = false;
      }

    });
  }

}
