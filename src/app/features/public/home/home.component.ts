import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
