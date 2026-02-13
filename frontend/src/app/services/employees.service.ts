import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';


@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor() { }

  getAllEmployees(): Observable<Employee[]> {
    const employeesCollection = collection(db, 'employees');
    return from(getDocs(employeesCollection)).pipe(
      map(snapshot =>
        snapshot.docs.map(d => {
          const data = d.data() as any;
          return {
            id: d.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            salary: data.salary,
            department: data.department
          } as Employee;
        })
      )
    );
  }

  addEmployee(addEmployeeRequest: Employee): Observable<Employee> {
    const employeesCollection = collection(db, 'employees');
    const employeeToSave = {
      name: addEmployeeRequest.name,
      email: addEmployeeRequest.email,
      phone: addEmployeeRequest.phone,
      salary: addEmployeeRequest.salary,
      department: addEmployeeRequest.department
    };
    return from(addDoc(employeesCollection, employeeToSave)).pipe(
      map(ref => ({
        id: ref.id,
        ...employeeToSave
      } as Employee))
    );
  }

  // addEmployee(addEmployeeRequest: Employee): Observable<Employee> {
  //   return this.http.post<Employee>(this.baseApiUrl + '/api/employees/', addEmployeeRequest, httpOptions); 
  // }

  getEmployee(id: string): Observable<Employee> {
    const employeeDoc = doc(db, 'employees', id);
    return from(getDoc(employeeDoc)).pipe(
      map(snapshot => {
        const data = snapshot.data() as any;
        return {
          id: snapshot.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          salary: data.salary,
          department: data.department
        } as Employee;
      })
    );
  }


  updateEmployee(id: string, updateEmployeeRequest: Employee):
   Observable<Employee> {
    const employeeDoc = doc(db, 'employees', id);
    const employeeToUpdate = {
      name: updateEmployeeRequest.name,
      email: updateEmployeeRequest.email,
      phone: updateEmployeeRequest.phone,
      salary: updateEmployeeRequest.salary,
      department: updateEmployeeRequest.department
    };
    return from(updateDoc(employeeDoc, employeeToUpdate)).pipe(
      map(() => ({
        id,
        ...employeeToUpdate
      } as Employee))
    );
  }

  deleteEmployee(id: string): Observable<Employee> {
    const employeeDoc = doc(db, 'employees', id);
    return from(deleteDoc(employeeDoc)).pipe(
      map(
        () =>
          ({
            id,
            name: '',
            email: '',
            phone: 0,
            salary: 0,
            department: ''
          } as Employee)
      )
    );
  }

}
