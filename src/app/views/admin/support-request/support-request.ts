import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../core/services/support.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { SupportTicket } from '../../../library/shared/components/support-ticket/support-ticket';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { Chip } from "../../../library/ui/components/chip/chip";
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-support-request',
  standalone: true,
  imports: [CommonModule, FormsModule, SupportTicket, InputField, Button, Chip],
  providers: [DatePipe],
  templateUrl: './support-request.html',
  styleUrl: './support-request.css'
})
export class SupportRequest implements OnInit, OnDestroy {
  isLoading = true;
  
  // Modal Data
  selectedTicket: any = null;
  replyMessage = '';
  isReplying = false;

  // RxJS Filters
  rawTickets$ = new BehaviorSubject<any[]>([]);
  searchTerm$ = new BehaviorSubject<string>('');
  statusFilter$ = new BehaviorSubject<string>('');
  categoryFilter$ = new BehaviorSubject<string>('');
  
  localSearchTerm = '';
  localStatusFilter = '';
  localCategoryFilter = '';
  
  statusOptions: InputOption[] = [{ label: 'All Statuses', value: '' }];
  categoryOptions: InputOption[] = [{ label: 'All Categories', value: '' }];
  
  ticketStatuses: any[] = [];
  ticketCategories: any[] = [];

  activeFilters: { key: string, label: string, value: any }[] = [];

  filteredTickets$!: Observable<any[]>;

  constructor(
    private supportService: SupportService,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit() {
    this.filteredTickets$ = combineLatest([
      this.rawTickets$,
      this.searchTerm$.pipe(debounceTime(300)),
      this.statusFilter$,
      this.categoryFilter$
    ]).pipe(
      map(([tickets, search, status, category]) => {
        let filtered = [...tickets];
        
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(t => 
            (t.ticketId && t.ticketId.toLowerCase().includes(q)) || 
            (t.subject && t.subject.toLowerCase().includes(q)) ||
            (t.userName && t.userName.toLowerCase().includes(q))
          );
        }
        
        if (status) {
          filtered = filtered.filter(t => t.status === status);
        }

        if (category) {
          filtered = filtered.filter(t => t.category === category);
        }
        
        this.updateActiveFilters(search, status, category);

        return filtered;
      })
    );
    this.fetchTickets();
    this.fetchMasterData();
  }

  ngOnDestroy() {}

  onSearchChange(val: string) {
    this.localSearchTerm = val;
  }

  onStatusChange(val: string) {
    this.localStatusFilter = val;
  }

  onCategoryChange(val: string) {
    this.localCategoryFilter = val;
  }

  applyFilters() {
    this.searchTerm$.next(this.localSearchTerm);
    this.statusFilter$.next(this.localStatusFilter);
    this.categoryFilter$.next(this.localCategoryFilter);
  }

  updateActiveFilters(search: string, status: string, category: string) {
    this.activeFilters = [];
    if (search) this.activeFilters.push({ key: 'search', label: `Search: ${search}`, value: search });
    if (status) {
      const label = this.statusOptions.find(o => o.value === status)?.label || status;
      this.activeFilters.push({ key: 'status', label: `Status: ${label}`, value: status });
    }
    if (category) {
      const label = this.categoryOptions.find(o => o.value === category)?.label || category;
      this.activeFilters.push({ key: 'category', label: `Category: ${label}`, value: category });
    }
  }

  removeFilter(filter: any) {
    if (filter.key === 'search') {
      this.localSearchTerm = '';
      this.searchTerm$.next('');
    }
    if (filter.key === 'status') {
      this.localStatusFilter = '';
      this.statusFilter$.next('');
    }
    if (filter.key === 'category') {
      this.localCategoryFilter = '';
      this.categoryFilter$.next('');
    }
  }

  resetFilters() {
    this.localSearchTerm = '';
    this.localStatusFilter = '';
    this.localCategoryFilter = '';
    this.searchTerm$.next('');
    this.statusFilter$.next('');
    this.categoryFilter$.next('');
  }

  fetchMasterData() {
    this.masterDataService.getMasterDataByCategory('SupportTicketStatus').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const opts = res.data.map((opt: any) => ({ label: opt.value, value: opt.key }));
          this.statusOptions = [{ label: 'All Statuses', value: '' }, ...opts];
          this.ticketStatuses = res.data;
        }
      }
    });

    this.masterDataService.getMasterDataByCategory('SupportTicketCategory').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const opts = res.data.map((opt: any) => ({ label: opt.value, value: opt.key }));
          this.categoryOptions = [{ label: 'All Categories', value: '' }, ...opts];
          this.ticketCategories = res.data;
        }
      }
    });
  }

  fetchTickets() {
    this.isLoading = true;
    this.supportService.getAllTicketsAdmin().subscribe({
      next: (res) => {
        if (res.success) {
          this.rawTickets$.next(res.tickets || []);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tickets', err);
        this.isLoading = false;
      }
    });
  }

  selectTicket(ticket: any) {
    this.selectedTicket = ticket;
    this.replyMessage = '';
  }

  submitReply() {
    if (!this.replyMessage.trim() || !this.selectedTicket) return;
    
    this.isReplying = true;
    const payload = {
      message: this.replyMessage,
      attachments: [] // Admins only send text based on user requirements
    };

    this.supportService.replyToTicketAdmin(this.selectedTicket.ticketId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.ticket && res.ticket.replies) {
             this.selectedTicket.replies = res.ticket.replies;
          } else if (res.reply) {
             this.selectedTicket.replies.push(res.reply);
          }
          this.selectedTicket.status = res.ticket ? res.ticket.status : 'WaitingForUser';
          this.replyMessage = '';
          
          // Re-trigger the subject to update the UI
          this.rawTickets$.next([...this.rawTickets$.value]);
        }
        this.isReplying = false;
      },
      error: (err) => {
        console.error('Error submitting reply', err);
        this.isReplying = false;
      }
    });
  }

  changeStatus(status: string) {
    if (!this.selectedTicket) return;
    this.supportService.updateTicketStatus(this.selectedTicket.ticketId, status).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedTicket.status = status;
          this.rawTickets$.next([...this.rawTickets$.value]);
        }
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  getStatusBadgeClass(status: string): string {
    const map: {[key: string]: string} = {
      'Open': 'bg-primary bg-opacity-10 text-primary border-primary',
      'WaitingForAdmin': 'bg-warning bg-opacity-10 text-warning-dark border-warning',
      'WaitingForUser': 'bg-info bg-opacity-10 text-info border-info',
      'Resolved': 'bg-success bg-opacity-10 text-success border-success',
      'Closed': 'bg-secondary bg-opacity-10 text-secondary border-secondary'
    };
    return map[status] ? `${map[status]} border border-opacity-50` : 'bg-primary bg-opacity-10 text-primary';
  }
}
