import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Badge } from '../../../ui/components/badge/badge';
import { Button } from '../../../ui/components/button/button';
import { Contract } from '../../../../core/models/contract.model';
import {
  Dropdown,
  DropdownItem
} from '../../../ui/components/dropdown/dropdown';


export type ContractCardRole = 'freelancer' | 'client';


export interface ContractCardAction {
  label: string;
  value: string;
  icon: string;
  className?: string;
}


@Component({
  selector: 'app-contract-card',
  standalone: true,

  imports: [
    CommonModule,
    Button,
    Badge,
    Dropdown
  ],

  templateUrl: './contract-card.html',
  styleUrl: './contract-card.css'
})
export class ContractCard {

  /*
   * Contract data.
   */
  @Input()
  contract: Contract | null = null;


  /*
   * Determines which version of the card is displayed.
   *
   * freelancer -> freelancer UI
   * client     -> client UI
   */
  @Input()
  role: ContractCardRole = 'freelancer';


  /*
   * Client-side actions.
   */
  @Input()
  actions: ContractCardAction[] = [];


  /*
   * Freelancer events.
   */
  @Output()
  viewDetails = new EventEmitter<Contract>();


  @Output()
  apply = new EventEmitter<Contract>();


  @Output()
  save = new EventEmitter<Contract>();


  /*
   * Client action event.
   */
  @Output()
  action = new EventEmitter<{
    action: string;
    contract: Contract;
  }>();


  /*
   * =========================================
   * ROLE HELPERS
   * =========================================
   */

  get isFreelancer(): boolean {
    return this.role === 'freelancer';
  }


  get isClient(): boolean {
    return this.role === 'client';
  }


  /*
   * =========================================
   * FREELANCER ACTIONS
   * =========================================
   */

  onViewDetails(): void {

    if (!this.contract) {
      return;
    }

    this.viewDetails.emit(this.contract);
  }


  onApply(): void {

    if (!this.contract) {
      return;
    }

    this.apply.emit(this.contract);
  }


  onSave(): void {

    if (!this.contract) {
      return;
    }

    this.save.emit(this.contract);
  }


  /*
   * =========================================
   * CLIENT ACTION
   * =========================================
   *
   * Used by normal client buttons if supplied
   * through the actions input.
   */

  onAction(item: ContractCardAction): void {

    if (!this.contract) {
      return;
    }

    this.action.emit({
      action: item.value,
      contract: this.contract
    });
  }


  /*
   * =========================================
   * CLIENT DROPDOWN
   * =========================================
   */

  getDropdownItems(): DropdownItem[] {

    if (!this.contract) {
      return [];
    }

    const items: DropdownItem[] = [

      {
        label: 'Applicants',
        value: 'applicants',
        icon: 'bi bi-people'
      },

      {
        label: 'Contract Progress',
        value: 'progress',
        icon: 'bi bi-graph-up'
      },

      {
        label: 'Edit',
        value: 'edit',
        icon: 'bi bi-pencil'
      }

    ];


    /*
     * Submit feedback only for completed
     * contracts where feedback is pending.
     */
    if (
      this.contract.status?.toLowerCase() === 'completed' &&
      !this.contract.feedbackSubmitted
    ) {

      items.push({
        label: 'Submit Feedback',
        value: 'feedback',
        icon: 'bi bi-star'
      });

    }


    /*
     * Fund Contract only when not funded.
     */
    if (!this.isFunded) {

      items.push({
        label: 'Fund Contract',
        value: 'fund',
        icon: 'bi bi-credit-card'
      });

    }


    /*
     * Delete.
     */
    items.push({
      label: 'Delete',
      value: 'delete',
      icon: 'bi bi-trash',
      className: 'dropdown-item-danger'
    });


    return items;
  }


  /*
   * Dropdown selection.
   *
   * The card does NOT navigate, delete, fund, etc.
   * It emits the action to the parent component.
   */
  onDropdownAction(item: DropdownItem): void {

    if (!this.contract) {
      return;
    }

    this.action.emit({
      action: item.value,
      contract: this.contract
    });
  }


  /*
   * =========================================
   * FORMATTED BUDGET
   * =========================================
   */

  get formattedBudget(): string {

    if (!this.contract) {
      return '';
    }

    return `${this.contract.currency || '₹'}${this.contract.estimatedBudget.toLocaleString('en-IN')}`;
  }


  /*
   * =========================================
   * FORMATTED SPENT
   * =========================================
   */

  get formattedSpent(): string {

    if (!this.contract?.spent) {
      return `${this.contract?.currency || '₹'}0`;
    }

    return `${this.contract.currency || '₹'}${this.contract.spent.toLocaleString('en-IN')}`;
  }


  /*
   * =========================================
   * FORMATTED START DATE
   * =========================================
   */

  get formattedStartDate(): string {

    if (!this.contract?.contractStartDate) {
      return '';
    }

    return this.formatDate(
      this.contract.contractStartDate
    );
  }


  /*
   * =========================================
   * FORMATTED END DATE
   * =========================================
   */

  get formattedEndDate(): string {

    if (!this.contract?.contractEndDate) {
      return '';
    }

    return this.formatDate(
      this.contract.contractEndDate
    );
  }


  /*
   * =========================================
   * STATUS VARIANT
   * =========================================
   */

  get statusVariant():
    'primary' |
    'secondary' |
    'success' |
    'warning' |
    'danger' |
    'info' |
    'purple' {

    switch (this.contract?.status) {

      case 'draft':
        return 'warning';

      case 'open':
        return 'info';

      case 'in progress':
        return 'primary';

      case 'completed':
        return 'success';

      case 'closed':
        return 'secondary';

      default:
        return 'secondary';
    }
  }


  /*
   * =========================================
   * FUNDING STATUS
   * =========================================
   */

  get isFunded(): boolean {

    return !!(
      this.contract?.funded &&
      this.contract.funded > 0
    );
  }


  /*
   * =========================================
   * DATE FORMATTER
   * =========================================
   */

  private formatDate(date: string): string {

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

}