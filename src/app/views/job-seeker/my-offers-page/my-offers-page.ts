import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Loader } from '../../../library/ui/components/loader/loader';
import { Modal } from '../../../library/ui/components/modal/modal';
import { OfferLetterCard } from '../../../library/shared/components/offer-letter-card/offer-letter-card';
import { OfferLetterCardData } from '../../../core/models/job.model';

export const STATIC_WORKSPHERE_OFFERS: OfferLetterCardData[] = [
  {
    _id: 'ofr-101',
    offerCode: 'OFR-WS-701',
    jobId: 'ws-job-103',
    jobCode: 'WS-FE-1104',
    jobTitle: 'Full Stack Lead Engineer',
    companyName: 'FinEdge Corp',
    companyLogo: 'https://ui-avatars.com/api/?name=Fin+Edge&background=059669&color=fff&bold=true&size=128',
    department: 'Digital Banking',
    location: 'Mumbai, India',
    workMode: 'Hybrid',
    employmentType: 'Full-Time',
    annualCtc: '₹36,00,000 / yr',
    fixedPay: '₹31,50,000',
    variableBonus: '₹4,50,000 + ESOPs',
    joiningDate: '2026-12-01',
    issuedDate: '2026-11-14',
    expiryDate: '2026-11-24',
    reportingManager: 'Siddharth Malhotra (Director of Engineering)',
    probationPeriod: '3 Months',
    noticePeriod: '60 Days',
    benefits: ['Family Health Cover (₹15L)', 'ESOP Grant', 'Hybrid Setup Stipend', 'Annual Learning Budget'],
    offerLetterUrl: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Worksphere FinTech Hub',
    status: 'Pending'
  },
  {
    _id: 'ofr-102',
    offerCode: 'OFR-WS-702',
    jobId: 'ws-job-101',
    jobCode: 'WS-TN-1042',
    jobTitle: 'Principal Frontend Engineer (Angular)',
    companyName: 'TechNova Solutions',
    companyLogo: 'https://ui-avatars.com/api/?name=Tech+Nova&background=4a3aff&color=fff&bold=true&size=128',
    department: 'Product Engineering',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    employmentType: 'Full-Time',
    annualCtc: '₹34,00,000 / yr',
    fixedPay: '₹30,00,000',
    variableBonus: '₹4,00,000 Joining Bonus',
    joiningDate: '2026-12-10',
    issuedDate: '2026-11-16',
    expiryDate: '2026-11-26',
    reportingManager: 'Vikramaditya Rao (VP Engineering)',
    probationPeriod: '3 Months',
    noticePeriod: '60 Days',
    benefits: ['Comprehensive Medical Insurance', 'MacBook Pro M4 Setup', 'Flexible Work Hours'],
    offerLetterUrl: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Worksphere Enterprise',
    status: 'Pending'
  },
  {
    _id: 'ofr-103',
    offerCode: 'OFR-WS-703',
    jobId: 'ws-job-105',
    jobCode: 'WS-NX-1150',
    jobTitle: 'Staff UI/UX & Design Systems Engineer',
    companyName: 'NexaVerse Commerce',
    companyLogo: 'https://ui-avatars.com/api/?name=Nexa+Verse&background=ea580c&color=fff&bold=true&size=128',
    department: 'Design Engineering',
    location: 'Pune, India',
    workMode: 'On-site',
    employmentType: 'Full-Time',
    annualCtc: '₹26,50,000 / yr',
    fixedPay: '₹24,00,000',
    variableBonus: '₹2,50,000 Performance Bonus',
    joiningDate: '2026-11-25',
    issuedDate: '2026-11-08',
    expiryDate: '2026-11-15',
    reportingManager: 'Meera Krishnan (Staff Frontend Lead)',
    probationPeriod: '6 Months',
    noticePeriod: '30 Days',
    benefits: ['Relocation Assistance', 'Health & Wellness Cover', 'Annual Conference Pass'],
    offerLetterUrl: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Worksphere Retail Portal',
    status: 'Accepted'
  }
];

@Component({
  selector: 'app-my-offers-page',
  standalone: true,
  imports: [CommonModule, InputField, Chip, Button, Badge, Loader, Modal, OfferLetterCard],
  templateUrl: './my-offers-page.html',
  styleUrl: './my-offers-page.css'
})
export class MyOffersPage implements OnInit {
  activeTab: 'all' | 'pending' | 'responded' = 'all';
  allOffers: OfferLetterCardData[] = [];
  filteredOffers: OfferLetterCardData[] = [];
  selectedOffer: OfferLetterCardData | null = null;
  pendingModalOffer: OfferLetterCardData | null = null;
  modalActionType: 'accept' | 'decline' = 'accept';
  isConfirmModalOpen: boolean = false;
  isLoading: boolean = false;
  actionMessage: string | null = null;

  searchQuery: string = '';
  selectedStatus: string = 'all';

  statusOptions: InputOption[] = [
    { label: 'All Offer Statuses', value: 'all' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Declined', value: 'Declined' }
  ];

  activeFilters: string[] = ['Direct Offer Letters', 'Worksphere Verified'];

  ngOnInit(): void {
    this.allOffers = STATIC_WORKSPHERE_OFFERS.map(o => ({ ...o }));
    this.applyFilters();
  }

  get displayedOffers(): OfferLetterCardData[] {
    if (this.activeTab === 'pending') {
      return this.filteredOffers.filter(o => o.status === 'Pending');
    }
    if (this.activeTab === 'responded') {
      return this.filteredOffers.filter(o => o.status === 'Accepted' || o.status === 'Declined');
    }
    return this.filteredOffers;
  }

  setTab(tab: 'all' | 'pending' | 'responded'): void {
    this.activeTab = tab;
  }

  applyFilters(): void {
    this.filteredOffers = this.allOffers.filter(offer => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        offer.jobTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offer.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offer.offerCode.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'all' || offer.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.activeFilters = ['Direct Offer Letters', 'Worksphere Verified'];
    this.applyFilters();
  }

  removeFilter(filterToRemove: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filterToRemove);
  }

  onViewOffer(offer: OfferLetterCardData): void {
    this.selectedOffer = offer;
    document.getElementById('openOfferOffcanvasBtn')?.click();
  }

  onAcceptOffer(offer: OfferLetterCardData): void {
    this.pendingModalOffer = offer;
    this.modalActionType = 'accept';
    this.isConfirmModalOpen = true;
  }

  onDeclineOffer(offer: OfferLetterCardData): void {
    this.pendingModalOffer = offer;
    this.modalActionType = 'decline';
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.pendingModalOffer = null;
  }

  confirmOfferDecision(): void {
    if (!this.pendingModalOffer) return;

    if (this.modalActionType === 'accept') {
      this.pendingModalOffer.status = 'Accepted';
      this.actionMessage = `Congratulations! You have accepted the offer for "${this.pendingModalOffer.jobTitle}" at ${this.pendingModalOffer.companyName}.`;
    } else {
      this.pendingModalOffer.status = 'Declined';
      this.actionMessage = `You have declined the offer for "${this.pendingModalOffer.jobTitle}" at ${this.pendingModalOffer.companyName}.`;
    }

    this.closeConfirmModal();
  }
}
