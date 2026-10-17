import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Dropdown, DropdownItem } from '../../../ui/components/dropdown/dropdown';
import { FreelancerCardData } from '../../../../core/models/user.model';

@Component({
  selector: 'app-freelancer-card',
  standalone: true,
  imports: [CommonModule, Badge, Dropdown],
  providers: [DatePipe],
  templateUrl: './freelancer-card.html',
  styleUrl: './freelancer-card.css'
})
export class FreelancerCard {
  @Input() freelancer!: FreelancerCardData | any;
  @Input() actionItems?: DropdownItem[];
  @Input() showFooter: boolean = true;

  @Output() actionSelected = new EventEmitter<{ action: DropdownItem; freelancer: any }>();
  @Output() view = new EventEmitter<any>();

  get displayName(): string {
    return this.freelancer?.name || 'Freelancer';
  }

  get avatarUrl(): string {
    return this.freelancer?.profileImage || `https://i.pravatar.cc/150?u=${this.freelancer?.id || 'freelancer'}`;
  }

  getActions(): DropdownItem[] {
    if (this.actionItems && this.actionItems.length > 0) {
      return this.actionItems;
    }

    const items: DropdownItem[] = [
      { label: 'View Profile', value: 'view', icon: 'bi-eye text-primary' }
    ];

    const status = this.freelancer?.status;
    if (status === 'Pending Approval') {
      items.push({ label: 'Approve', value: 'Approve', icon: 'bi-person-check text-primary' });
    }
    if (status !== 'Active' && status !== 'Pending Approval') {
      items.push({ label: 'Activate', value: 'Active', icon: 'bi-check-circle text-success' });
    }
    if (status === 'Active') {
      items.push({ label: 'Suspend', value: 'Suspended', icon: 'bi-pause-circle text-warning' });
    }
    if (status !== 'Blocked' && status !== 'Deactivated') {
      items.push({ label: 'Block', value: 'Blocked', icon: 'bi-slash-circle text-danger' });
    }
    if (status !== 'Deactivated') {
      items.push({ label: 'Deactivate', value: 'Deactivated', icon: 'bi-trash text-danger' });
    }

    return items;
  }

  onActionSelect(item: DropdownItem): void {
    this.actionSelected.emit({ action: item, freelancer: this.freelancer });
    if (item.value === 'view') {
      this.view.emit(this.freelancer);
    }
  }

  onViewClick(): void {
    this.view.emit(this.freelancer);
    this.actionSelected.emit({
      action: { label: 'View', value: 'view', icon: 'bi-eye text-primary' },
      freelancer: this.freelancer
    });
  }

  getBadgeVariant(status?: string): 'success' | 'danger' | 'warning' | 'primary' {
    if (status === 'Active') return 'success';
    if (status === 'Suspended' || status === 'Blocked' || status === 'Deactivated') return 'danger';
    if (status === 'Pending Approval') return 'primary';
    return 'warning';
  }
}
