import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TalentCardComponent } from '../../../../../shared/components/talent-card/talent-card.component';

@Component({
  selector: 'app-hired-talent',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputComponent, ButtonComponent, TalentCardComponent],
  templateUrl: './hired-talent.component.html',
  styleUrl: './hired-talent.component.css'
})
export class HiredTalentComponent implements OnInit {
  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);
  private diaryService = inject(ContractDiaryService);
  private route = inject(ActivatedRoute);

  // Filter options
  statusOptions = [
    { label: 'All Status', value: 'All Status' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Shortlisted', value: 'Shortlisted' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  typeOptions = [
    { label: 'All Types', value: 'All Types' },
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Hourly', value: 'Hourly' }
  ];

  // Tabs: 'offers' (Pending Offers) | 'hired' (Hired Talents)
  activeTab: 'offers' | 'hired' = 'offers';

  // Sent Offers (offerStatus !== 'accepted')
  offers: any[] = [];
  isLoading = true;

  // Grouped Hired Talents (offerStatus === 'accepted'), grouped by contract
  groupedHiredContracts: any[] = [];

  // Track which applicationIds already have a diary
  existingDiaryMap: Set<string> = new Set();
  initializingDiary: Set<string> = new Set();

  searchQuery = '';
  statusFilter = 'All Status';
  typeFilter = 'All Types';

  ngOnInit(): void {
    // Check for query parameters to switch tabs
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'hired') {
        this.activeTab = 'hired';
      }
    });

    this.fetchHiredTalents();
  }

  fetchHiredTalents(): void {
    this.isLoading = true;

    // Fetch existing diaries in parallel
    this.diaryService.getClientDiaries().subscribe({
      next: (diaryRes: any) => {
        if (diaryRes.success && diaryRes.diaries) {
          diaryRes.diaries.forEach((d: any) => this.existingDiaryMap.add(d.applicationId?.toString()));
        }
      },
      error: () => { } // non-critical
    });

    this.contractService.getHiredTalents().subscribe({
      next: (res: any) => {
        if (res.success && res.hiredTalents) {
          const allHired = res.hiredTalents;

          // Tab 1: Pending & Pipelines (not accepted yet)
          this.offers = allHired.filter((t: any) => t.offerStatus !== 'accepted');

          // Tab 2: Hired Talents (accepted offers)
          const acceptedHires = allHired.filter((t: any) => t.offerStatus === 'accepted');

          // Group accepted hires by contract
          const groupsMap = new Map<string, any>();
          acceptedHires.forEach((hire: any) => {
            const contractId = hire.contract?._id || 'unknown';
            if (!groupsMap.has(contractId)) {
              groupsMap.set(contractId, {
                contractId: contractId,
                contractTitle: hire.contract?.title || 'Unknown Contract',
                contractStatus: hire.contract?.status || 'Active',
                contractBudget: hire.contract?.estimatedBudget || 0,
                contractFunded: hire.contract?.funded || 0,
                contractType: hire.contract?.budgetType || 'Fixed Price',
                contractStartDate: hire.contract?.contractStartDate || null,
                contractEndDate: hire.contract?.contractEndDate || null,
                talents: [],
                isExpanded: true
              });
            }
            groupsMap.get(contractId).talents.push(hire);
          });

          this.groupedHiredContracts = Array.from(groupsMap.values());
        } else {
          this.offers = [];
          this.groupedHiredContracts = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch hired talents:', err);
        this.offers = [];
        this.groupedHiredContracts = [];
        this.isLoading = false;
      }
    });
  }

  /** Initialize a contract diary for the first accepted freelancer in a group */
  initializeDiary(group: any): void {
    const firstTalent = group.talents[0];
    if (!firstTalent?.applicationId) return;

    this.initializingDiary.add(group.contractId);

    this.diaryService.initializeDiary({
      applicationId: firstTalent.applicationId,
      phases: []
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.existingDiaryMap.add(firstTalent.applicationId);
        }
        this.initializingDiary.delete(group.contractId);
      },
      error: (err: any) => {
        console.error('Failed to initialize diary:', err);
        this.initializingDiary.delete(group.contractId);
      }
    });
  }

  hasDiary(group: any): boolean {
    return group.talents.some((t: any) => this.existingDiaryMap.has(t.applicationId?.toString()));
  }

  // Filter offers based on search and selected options
  get filteredOffers(): any[] {
    return this.offers.filter(offer => {
      const name = offer.freelancer?.fullName || '';
      const headline = offer.freelancer?.professionalHeadline || '';
      const title = offer.contract?.title || '';

      const matchesSearch = name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        headline.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        title.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Status mapping
      let displayStatus = 'Pending';
      if (offer.offerStatus === 'declined') displayStatus = 'Rejected';
      if (offer.offerStatus === 'sent') displayStatus = 'Pending';
      if (!offer.offerStatus || offer.offerStatus === 'none') displayStatus = 'Shortlisted';

      const matchesStatus = this.statusFilter === 'All Status' || displayStatus === this.statusFilter;

      // Contract type mapping
      const contractType = offer.contract?.budgetType === 'Hourly Rate' ? 'Hourly' : 'Fixed Price';
      const matchesType = this.typeFilter === 'All Types' || contractType === this.typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  switchTab(tab: 'offers' | 'hired'): void {
    this.activeTab = tab;
  }

  toggleGroup(group: any): void {
    group.isExpanded = !group.isExpanded;
  }

  getContractPdfUrl(appId: string): string {
    return this.applicationService.getContractPdfUrl(appId);
  }

  downloadSignedContract(offer: any): void {
    const appId = offer.applicationId;
    if (appId.startsWith('mock_')) {
      alert("PDF download is only available for real server-created offers.");
      return;
    }
    window.open(this.getContractPdfUrl(appId), '_blank');
  }

  getOfferRate(offer: any): string {
    const budget = offer.contract?.estimatedBudget || 0;
    const type = offer.contract?.budgetType || 'Fixed Price';
    return type === 'Hourly Rate' ? `$${budget}/hr` : `$${budget}`;
  }

  getOfferType(offer: any): string {
    return offer.contract?.budgetType === 'Hourly Rate' ? 'Hourly' : 'Fixed Price';
  }

  getPerformance(talent: any): number {
    const count = talent.freelancer?.completedContractsCount || 0;
    return Math.min(100, count * 10);
  }

  getPerformanceTier(performance: number): string {
    if (performance >= 80) return 'High';
    if (performance >= 40) return 'Medium';
    return 'Low';
  }

  get offersCount(): number {
    return this.offers.length;
  }

  get hiredCount(): number {
    return this.groupedHiredContracts.reduce((sum, group) => sum + (group.talents?.length || 0), 0);
  }

  getOfferStats(offer: any, label: 'Offer Value' | 'Hired Rate' = 'Offer Value'): any[] {
    return [
      { value: this.getOfferRate(offer), label: label },
      { value: this.getOfferType(offer), label: label === 'Offer Value' ? 'Payment Type' : 'Type' }
    ];
  }
}
