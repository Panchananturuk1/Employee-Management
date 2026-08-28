import { Component, OnInit, EventEmitter,Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  employeeDetails: Employee = {

    id: '',
    name: '',
    email: '',
    phone: 0,
    salary: 0,
    department: '',
  }

  // @Input() hero?: Employee;
  // @Output() heroesUpdated = new EventEmitter<Employee[]>();


  constructor(private route: ActivatedRoute, private employeeService: EmployeesService,
    private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if(id){
          this.employeeService.getEmployee(id)
          .subscribe({
            next: (response) => {
              this.employeeDetails = response;
            },
            error: () => {
              this.toastService.error('That employee could not be found.');
              this.router.navigate(['employees']);
            }
          });
        }
      }
     
    })
  }

  // updateEmployee(){
  //   this.employeeService.updateEmployee(this.employeeDetails.id, this.employeeDetails)
  //   .subscribe({
  //     next: (response) => {
  //       this.router.navigate(['employees']);
  //     }
  //   });
  // }


  updateEmployee = () => {
    this.employeeService.updateEmployee(this.employeeDetails.id, this.employeeDetails)
      .subscribe({
        next: () => {
          this.toastService.success(`${this.employeeDetails.name} was updated.`);
          this.router.navigate(['employees']);
        },
        error: () => this.toastService.error('Could not save your changes. Please try again.')
      });
  };


  deleteEmployee(id: string){
    const name = this.employeeDetails.name;

    this.employeeService.deleteEmployee(id)
    .subscribe({
      next: (response) => {
        this.toastService.success(`${name} was removed.`);
        this.router.navigate(['employees']);
      },
      error: () => this.toastService.error(`Could not delete ${name}. Please try again.`)
    });
  }

}
