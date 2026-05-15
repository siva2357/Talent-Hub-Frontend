import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: 'app-hourly-work-diary',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hourly-work-diary.component.html',
  styleUrl: './hourly-work-diary.component.css'
})
export class HourlyWorkDiaryComponent {
  isExpanded: boolean = true;
  isModalOpen: boolean = false;

  toggleAccordion(): void {
    this.isExpanded = !this.isExpanded;
  }

  showModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
