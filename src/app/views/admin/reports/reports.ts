import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ReportCard } from '../../shared/report-card/report-card';
import { Button } from '../../../library/ui/components/button/button';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from "../../../library/ui/components/chip/chip";
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportCard, Button, InputField, Chip],
  providers: [DatePipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  rawReports$ = new BehaviorSubject<any[]>([]);
  searchTerm$ = new BehaviorSubject<string>('');
  typeFilter$ = new BehaviorSubject<string>('');
  
  localSearchTerm = '';
  localTypeFilter = '';
  
  typeOptions: InputOption[] = [
    { label: 'All Types', value: '' },
    { label: 'Audit', value: 'Audit' },
    { label: 'Analytics', value: 'Analytics' },
    { label: 'Financial', value: 'Financial' }
  ];

  activeFilters: { key: string, label: string, value: any }[] = [];
  
  filteredReports$!: Observable<any[]>;
  isLoading = true;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this.filteredReports$ = combineLatest([
      this.rawReports$,
      this.searchTerm$.pipe(debounceTime(300)),
      this.typeFilter$
    ]).pipe(
      map(([reports, search, type]) => {
        let filtered = [...reports];
        
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(r => 
            (r.title && r.title.toLowerCase().includes(q)) || 
            (r.description && r.description.toLowerCase().includes(q))
          );
        }
        
        if (type) {
          filtered = filtered.filter(r => r.type === type);
        }
        
        this.updateActiveFilters(search, type);

        return filtered;
      })
    );

    this.fetchReports();
  }

  fetchReports() {
    this.isLoading = true;
    this.adminService.getReports().subscribe({
      next: (res) => {
        if (res.success) {
          this.rawReports$.next(res.reports || []);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reports', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(val: string) {
    this.localSearchTerm = val;
  }

  onTypeChange(val: string) {
    this.localTypeFilter = val;
  }

  applyFilters() {
    this.searchTerm$.next(this.localSearchTerm);
    this.typeFilter$.next(this.localTypeFilter);
  }

  updateActiveFilters(search: string, type: string) {
    this.activeFilters = [];
    if (search) this.activeFilters.push({ key: 'search', label: `Search: ${search}`, value: search });
    if (type) {
      const label = this.typeOptions.find(o => o.value === type)?.label || type;
      this.activeFilters.push({ key: 'type', label: `Type: ${label}`, value: type });
    }
  }

  removeFilter(filter: any) {
    if (filter.key === 'search') {
      this.localSearchTerm = '';
      this.searchTerm$.next('');
    }
    if (filter.key === 'type') {
      this.localTypeFilter = '';
      this.typeFilter$.next('');
    }
  }

  resetFilters() {
    this.localSearchTerm = '';
    this.localTypeFilter = '';
    this.searchTerm$.next('');
    this.typeFilter$.next('');
  }
}
