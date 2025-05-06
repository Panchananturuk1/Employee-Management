import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseApiUrl: string = environment.baseApiUrl;
  private url = 'SuperHero';

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseApiUrl + '/api/employees');
  }

  addEmployee(addEmployeeRequest: Employee): Observable<Employee[]> {
    addEmployeeRequest.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Employee[]>(this.baseApiUrl + '/api/employees/', addEmployeeRequest); 
  }

  // addEmployee(addEmployeeRequest: Employee): Observable<Employee> {
  //   return this.http.post<Employee>(this.baseApiUrl + '/api/employees/', addEmployeeRequest, httpOptions); 
  // }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(this.baseApiUrl + '/api/employees/' + id);
  }


  updateEmployee(id: string, updateEmployeeRequest: Employee):
   Observable<Employee> {
    return this.http.put<Employee>(this.baseApiUrl + '/api/employees/' + id, updateEmployeeRequest, httpOptions);
  }

  deleteEmployee(id: string): Observable<Employee> {
    return this.http.delete<Employee>(this.baseApiUrl + '/api/employees/' + id);
  }

}
