import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-form.component.html',
  styleUrl: './contract-form.component.css'
})
export class ContractFormComponent {
  contractData = {
    title: '',
    description: '',
    category: 'Development',
    budgetType: 'fixed',
    budgetAmount: 0,
    deadline: ''
  };

  onSubmit() {
    console.log('Contract submitted:', this.contractData);
  }
}
