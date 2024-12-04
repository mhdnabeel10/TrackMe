import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../../shared/Services/dashboard.service';
import { CommonModule } from '@angular/common';
import { EmployeeList } from '../dashboard-interface';
import { FormsModule } from '@angular/forms';
import * as Papa from 'papaparse';



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  @Input() isActions: boolean = true; // Control visibility of actions
  @Input() isReviewFormVisible: boolean = false; // Control visibility of Review 
  @Input() isReviewBtn: boolean = false; // Control visibility of Review 
  @Input() isEmpComponent: boolean = true; // Control visibility of Review 
  searchQuery: string = ''; // To store the search query
  sortAscending: boolean = true; // To toggle sort direction
  
  selectedFile: File | null = null;
  parsedEmployees: any[] = []

  employesList: EmployeeList[] = [];
  isEditMode = false;
  selectedEmployee: EmployeeList | null = null;
  
  reviewData = {
    score: '',
    comments: '',
  };

  newEmployee: EmployeeList = {
    id: '0',
    name: '',
    department: '',
    position: '',
    performance: {
      lastUpdated: '',
      comments: '',
      score: 0
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getEmployeData().subscribe((response) => {
      console.log('Employee data received:', response);
      this.employesList = response;
    },
    (error) => {
      console.error('Error fetching employee data', error);  // Log any error that occurs
    });
  }

  openAddEmployeeForm(): void {
    this.isEditMode = false;
    this.selectedEmployee = null;
    this.newEmployee = this.initializeEmployee();
    this.resetForm();
  }
  initializeEmployee(): EmployeeList {
    throw new Error('Method not implemented.');
  }

  openEditEmployeeForm(employee: EmployeeList): void {
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.newEmployee = { ...employee }; // Pre-fill form with selected employee data
  }

  saveEmployee(): void {
    if (this.isEditMode && this.selectedEmployee) {
      // Update existing employee
      console.log(this.newEmployee);
      this.dashboardService.updateEmployee(this.newEmployee).subscribe(
        (updatedEmployee) => {
          const index = this.employesList.findIndex(
            (emp) => emp.id === updatedEmployee.id
          );
          
          if (index !== -1) {
            this.employesList[index] = updatedEmployee;
          }
          this.resetForm();
        },
        (error) => {
          console.error('Error updating employee', error);
        }
      );
    } else {
      // Add new employee
      this.dashboardService.addEmployee(this.newEmployee).subscribe(
        (addedEmployee) => {
          this.employesList.push(addedEmployee);
          this.resetForm();
        },
        (error) => {
          console.error('Error adding new employee', error);
        }
      );
    }
  }
  
 // deleting employee
  deleteEmployee(employeeId: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.dashboardService.deleteEmployee(Number(employeeId)).subscribe(
        () => {
          this.employesList = this.employesList.filter(emp => Number(emp.id) !== Number(employeeId));
          console.log(`Employee with ID ${employeeId} deleted successfully.`);
        },
        (error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete the employee. Please try again.');
        }
      );
    }
  }

  resetForm(): void {
    this.newEmployee = {
      id: '0',
      name: '',
      department: '',
      position: '',
      performance: {
        lastUpdated: '',
        comments: '',
        score: 0
      },
    };
    this.isEditMode = false;
    this.selectedEmployee = null;
  }
//for selecting file CSV
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.parseCSV(this.selectedFile);
    }
  }

  parseCSV(file: File): void {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        this.parsedEmployees = result.data.map((row) => {
          const employee = row as EmployeeList; // Cast row to Employee
          employee.performance = employee.performance || {}; // Ensure performance exists
          employee.performance.score = Number(employee.performance.score) || 0; // Ensure score is a number or default to 0
          return employee;
        });
  
        if (this.validateCSV(this.parsedEmployees)) {
          this.uploadCSV();
        } else {
          console.error('Invalid CSV format');
        }
      },
      error: (error) => {
        console.error('Error parsing CSV file:', error);
      },
    });
  }
  
  
// function for uploadingCSV 
  uploadCSV(): void {
    if (this.parsedEmployees.length > 0) {
      this.dashboardService.getEmployeData().subscribe(
        (existingEmployees) => {
          const existingIds = existingEmployees.map((emp) => Number(emp.id));
          let nextId = Math.max(...existingIds) + 1;
  
          this.parsedEmployees = this.parsedEmployees.map((newEmployee) => {
            if (existingIds.includes(Number(newEmployee.id))) {
              newEmployee.id = String(nextId++);
            }
  
            // Ensure performance and score are defined
            newEmployee.performance = newEmployee.performance || {};
            newEmployee.performance.score = Number(newEmployee.performance.score) || 0;
  
            return newEmployee;
          });
  
          this.dashboardService.addBulkEmployees(this.parsedEmployees).subscribe(
            () => {
              console.log('Employees added successfully');
            },
            (error) => {
              console.error('Error uploading employees:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching existing employees:', error);
        }
      );
    } else {
      console.error('No employees to upload');
    }
  }
  
  
  
   //validation of new CSV file
  validateCSV(data: any[]): boolean {
    const requiredFields = ['id', 'name', 'department', 'position', 'performance.lastUpdated', 'performance.comments', 'performance.score'];
    return data.every((row) =>
      requiredFields.every((field) => Object.prototype.hasOwnProperty.call(row, field)) &&
      row.performance && // Ensure performance exists
      !isNaN(Number(row.performance.score)) // Ensure score is a valid number
    );
  }
  

  
  // Function to open the employee review form
  openReviewForm(employee: EmployeeList): void {
    this.selectedEmployee = employee;
    // Pre-fill review form with employee's existing review data
    this.reviewData = {
      score: employee.performance.score.toString(),
      comments: employee.performance.comments,
    };
    this.isReviewFormVisible = true;
  }

  // Function to submit the review and update the employee data
  submitReview(): void {
    if (this.selectedEmployee) {
      const score = parseInt(this.reviewData.score, 10);
      if (!isNaN(score) && score >= 1 && score <= 10) {
        this.selectedEmployee.performance.score = score;
        this.selectedEmployee.performance.comments = this.reviewData.comments;
        
        // Update the employee
        this.dashboardService.updateEmployee(this.selectedEmployee).subscribe(
          (updatedEmployee) => {
            console.log('Employee updated successfully:', updatedEmployee);
          },
          (error) => {
            console.error('Error updating employee:', error);
          }
        );
      }
    }
  
    // Reset form and hide review form
    this.resetReviewForm();
  }

  // Reset review form after submission or cancellation
  resetReviewForm(): void {
    this.reviewData = { score: '', comments: '' };
    this.isReviewFormVisible = false;
    this.selectedEmployee = null;
  }
  // Filter employees by search query (name or department)
get filteredEmployees(): EmployeeList[] {
  return this.employesList.filter((employee) =>
    employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(this.searchQuery.toLowerCase())
  );
}

// Sort employees by performance score
sortByPerformance(): void {
  this.sortAscending = !this.sortAscending; // Toggle sorting direction
  this.employesList.sort((a, b) => {
    const diff = a.performance.score - b.performance.score;
    return this.sortAscending ? diff : -diff;
  });
}
}


