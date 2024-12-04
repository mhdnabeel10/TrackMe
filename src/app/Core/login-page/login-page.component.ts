import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  role: string = '';
  isLoginPage = false;
  

  constructor(private router: Router) {}
//  check its the admin or hr if it is redirect to dashboard or if not gives alert
  login() {
    if (this.username === 'admin' && this.password === 'admin123') {
      localStorage.setItem(
        'user',
        JSON.stringify({ username: this.username, role: 'admin' })
      );
      this.router.navigate(['/dashboard']);
    } else if (this.username === 'hr' && this.password === 'hr123') {
      localStorage.setItem(
        'user',
        JSON.stringify({ username: this.username, role: 'hr' })
      );
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials!');
    }
  }
}
