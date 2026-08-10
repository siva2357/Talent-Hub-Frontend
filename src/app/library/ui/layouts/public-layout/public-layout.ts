import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicNavbar } from '../public-navbar/public-navbar';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicNavbar],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayout {

}
