import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: 'app-contract-diary',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './contract-diary.component.html',
  styleUrl: './contract-diary.component.css'
})
export class ContractDiaryComponent {
  isExpanded: boolean = false;

  toggleAccordion() {
    this.isExpanded = !this.isExpanded;
  }
}
