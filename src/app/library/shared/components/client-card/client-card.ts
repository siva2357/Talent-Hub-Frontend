import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Dropdown, DropdownItem } from '../../../ui/components/dropdown/dropdown';
import { ClientCardData } from '../../../../core/models/user.model';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule, Badge, Dropdown],
  providers: [DatePipe],
  templateUrl: './client-card.html',
  styleUrl: './client-card.css'
})
export class ClientCard {
  @Input() client!: ClientCardData | any;
  @Input() actionItems?: DropdownItem[];
  @Input() showFooter: boolean = true;

  @Output() actionSelected = new EventEmitter<{ action: DropdownItem; client: any }>();
  @Output() view = new EventEmitter<any>();

  get displayName(): string {
    return this.client?.name || this.client?.clientName || 'Client';
  }

  get avatarUrl(): string {
    return this.client?.profileImage || `https://i.pravatar.cc/150?u=${this.client?.id || 'client'}`;
  }

  getActions(): DropdownItem[] {
    if (this.actionItems && this.actionItems.length > 0) {
      return this.actionItems;
    }

    const items: DropdownItem[] = [
      { label: 'View Profile', value: 'view', icon: 'bi-eye text-primary' }
    ];

    const status = this.client?.status;
    if (status !== 'Active') {
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
    this.actionSelected.emit({ action: item, client: this.client });
    if (item.value === 'view') {
      this.view.emit(this.client);
    }
  }

  onViewClick(): void {
    this.view.emit(this.client);
    this.actionSelected.emit({
      action: { label: 'View', value: 'view', icon: 'bi-eye text-primary' },
      client: this.client
    });
  }

  getBadgeVariant(status?: string): 'success' | 'danger' | 'warning' | 'primary' {
    if (status === 'Active') return 'success';
    if (status === 'Suspended' || status === 'Blocked' || status === 'Deactivated') return 'danger';
    return 'warning';
  }
}
