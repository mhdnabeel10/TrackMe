import { Injectable } from '@angular/core';
import { EmployeeList, ReviewsData, } from '../../Feature/dashboard/dashboard-interface';
import { forkJoin, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';  // Import missing RxJS operators


@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000';
  employesList: EmployeeList[] = [];

  // Methods to retrieve data
  getEmployeData(): Observable<EmployeeList[]> {
    return this.http.get<EmployeeList[]>(`${this.baseUrl}/employees`);
    
  }

  addEmployee(employee: EmployeeList): Observable<EmployeeList> {
    return this.http.get<EmployeeList[]>(`${this.baseUrl}/employees`).pipe(
      map((employees) => {
        // Find the highest ID from the server
        const highestId = employees.reduce((max, emp) => (Number(emp.id) > max ? Number(emp.id) : max), 0);
        const newId = highestId+1
        console.log();
        
        // Create a new employee with an incremented ID
        const newEmployee = { ...employee, id: String(newId) };
        return newEmployee;
      }),
      switchMap((newEmployee) => {
        // Send the new employee to the backend
        return this.http.post<EmployeeList>(`${this.baseUrl}/employees`, newEmployee);
      })
    );
  }
  

  updateEmployee(employee: EmployeeList): Observable<EmployeeList> {
    console.log('Updating employee with ID:', employee.id); // Log the ID to verify
    return this.http.put<EmployeeList>(`${this.baseUrl}/employees/${employee.id}`, employee);
  }
  

  deleteEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/employees/${employeeId}`);
  }

  addBulkEmployees(employees: any[]): Observable<any> {
    const requests = employees.map((employee) => 
      this.http.post(`${this.baseUrl}/employees`, employee)
    );
    return forkJoin(requests); // Combine all HTTP POST requests
  }
  
  

  getDepartmentData(): Observable<ReviewsData[]> {
    return this.http.get<ReviewsData[]>(`${this.baseUrl}/departments`);
  }

  getReviewData(): Observable<ReviewsData[]> {
    return this.http.get<ReviewsData[]>(`${this.baseUrl}/reviews`);
  }
}
