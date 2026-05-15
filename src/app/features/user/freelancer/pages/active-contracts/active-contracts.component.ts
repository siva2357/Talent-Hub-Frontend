import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";



@Component({
  selector: 'app-active-contracts',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './active-contracts.component.html',
  styleUrl: './active-contracts.component.css'
})
export class ActiveContractsComponent { }
