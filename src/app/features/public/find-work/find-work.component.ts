import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-find-work',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './find-work.component.html',
  styleUrl: './find-work.component.css',
})
export class FindWorkComponent {}
