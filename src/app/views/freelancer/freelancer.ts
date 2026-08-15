import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../library/ui/layouts/sidebar/sidebar';
import { UserNavbar } from '../../library/ui/layouts/user-navbar/user-navbar';

@Component({
  selector: 'app-freelancer',
  standalone: true,
  imports: [RouterOutlet, Sidebar, UserNavbar],
  templateUrl: './freelancer.html',
  styleUrl: './freelancer.css'
})
export class Freelancer {

}
