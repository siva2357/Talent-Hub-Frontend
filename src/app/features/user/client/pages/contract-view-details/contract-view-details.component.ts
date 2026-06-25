import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-contract-view-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-view-details.component.html',
  styleUrl: './contract-view-details.component.css'
})
export class ContractViewDetailsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;


  loading: boolean = false;

  contractId: string = '';

  contract!: Contract;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    
this.route.queryParams.subscribe(params => {

  this.contractId = params['id'];

  if (this.contractId) {

    this.getContractById();

  }

});

  }

  // ========================================
  // GET CONTRACT BY ID
  // ========================================

  getContractById(): void {

    this.loading = true;

    this.contractService
      .getMyContractById(this.contractId)
      .subscribe({

        next: (response) => {

          this.contract = response.contract;

          this.loading = false;

        },

        error: (error) => {

          console.error(error);

          this.loading = false;

        }

      });

  }

}