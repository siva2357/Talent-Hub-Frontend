import { Component } from '@angular/core';
import { NotificationLayout } from "../notification-layout/notification-layout";
import { ProfileLayout } from "../profile-layout/profile-layout";

@Component({
  selector: 'app-navbar-layout',
  imports: [NotificationLayout, ProfileLayout],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css',
})
export class NavbarLayout {

}
