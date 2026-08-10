import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../library/ui/layouts/sidebar/sidebar';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client {

}
