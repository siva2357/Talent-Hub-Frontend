import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarLayout } from "../../layouts/sidebar-layout/sidebar-layout";

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, SidebarLayout,RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  standalone: true,
})
export class UserProfile {

}
