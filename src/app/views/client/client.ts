import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../library/ui/layouts/sidebar/sidebar';
import { UserNavbar } from '../../library/ui/layouts/user-navbar/user-navbar';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, Sidebar, UserNavbar],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client {

}
