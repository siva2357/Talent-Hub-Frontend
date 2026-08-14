import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  templateUrl: './user-navbar.html',
  styleUrl: './user-navbar.css'
})
export class UserNavbar {
  @Output() toggleSidebar = new EventEmitter<void>();
}
