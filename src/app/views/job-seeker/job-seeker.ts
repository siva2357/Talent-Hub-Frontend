import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../library/ui/layouts/sidebar/sidebar';
import { UserNavbar } from '../../library/ui/layouts/user-navbar/user-navbar';

@Component({
  selector: 'app-job-seeker',
  standalone: true,
  imports: [RouterOutlet, Sidebar, UserNavbar],
  templateUrl: './job-seeker.html',
  styleUrl: './job-seeker.css'
})
export class JobSeeker {

}
