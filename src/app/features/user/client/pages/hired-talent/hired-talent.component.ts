import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { TableColumn } from '@swimlane/ngx-datatable';

import { Table } from '../../../../../shared/components/table/table.component';

import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: 'app-hired-talent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Table,
    ButtonComponent
],
  templateUrl: './hired-talent.component.html',
  styleUrl: './hired-talent.component.css'
})
export class HiredTalentComponent implements OnInit {

  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  isLoading = true;

  contractId = '';

  hiredTalents: any[] = [];

  @ViewChild('profileTemplate', { static: true })
profileTemplate!: TemplateRef<any>;


columns: TableColumn[] = [];


ngOnInit(): void {

  this.columns = [
    {
      name: 'Profile',
      prop: 'profilePhoto',
      width: 90,
      cellTemplate: this.profileTemplate
    },
    {
      name: 'Freelancer',
      prop: 'fullName'
    },
    {
      name: 'Applied On',
      prop: 'appliedDate'
    },
    {
      name: 'Hired On',
      prop: 'hiredDate'
    },
    {
      name: 'Status',
      prop: 'applicationStatus'
    },
    {
      name: 'Offer',
      prop: 'offerStatus'
    }
  ];

  this.contractId =
    this.route.snapshot.queryParamMap.get('contractId') || '';

  if (this.contractId) {
    this.fetchHiredTalents();
  }
}

  fetchHiredTalents(): void {

    this.isLoading = true;

    this.contractService
      .getHiredTalents(this.contractId)
      .subscribe({

        next: (res: any) => {

          const talents =
            res?.success
              ? res.hiredTalents || []
              : [];

          this.hiredTalents = talents.map((talent: any) => ({
            ...talent,

  profilePhoto:
    talent.freelancer?.profilePhoto || '',
  fullName:talent.freelancer?.fullName || '',


            email:
              talent.freelancer?.email || '-',

            appliedDate:
              talent.appliedAt
                ? new Date(talent.appliedAt).toLocaleDateString()
                : '-',

            hiredDate:
              talent.hiredAt
                ? new Date(talent.hiredAt).toLocaleDateString()
                : '-'
          }));

          this.isLoading = false;
        },

        error: () => {

          this.hiredTalents = [];

          this.isLoading = false;
        }

      });

  }

  getContractPdfUrl(appId: string): string {
    return this.applicationService.getContractPdfUrl(appId);
  }

  downloadSignedContract(row: any): void {

    if (!row?.applicationId) return;

    window.open(
      this.getContractPdfUrl(row.applicationId),
      '_blank'
    );

  }

}