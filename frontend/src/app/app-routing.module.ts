import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { EmployeeDetailComponent } from './components/employees/employee-detail/employee-detail.component';
import { EmployeesListComponent } from './components/employees/employees-list/employees-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employees',
    component: EmployeesListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employees/add',
    component: AddEmployeeComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'employees/edit/:id',
    component: EditEmployeeComponent,
    canActivate: [AdminGuard]
  },
  {
    // Declared after the literal 'employees/...' routes so they win the match.
    path: 'employees/:id',
    component: EmployeeDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
