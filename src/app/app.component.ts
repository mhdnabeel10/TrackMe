import { Component, OnInit } from '@angular/core';
import { LoginPageComponent } from './Core/login-page/login-page.component';
import { RouterOutlet } from '@angular/router';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'employee-performance-management';
  

 

  ngOnInit() {
    
  }
  
}
