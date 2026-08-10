import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../library/ui/layouts/sidebar/sidebar';

@Component({
  selector: 'app-freelancer',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './freelancer.html',
  styleUrl: './freelancer.css'
})
export class Freelancer {

}
