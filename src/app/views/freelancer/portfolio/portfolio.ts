import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Table } from '../../../library/ui/components/table/table';
import { Button } from '../../../library/ui/components/button/button';
import { Dropdown } from '../../../library/ui/components/dropdown/dropdown';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { ModalService } from '../../../core/services/ui/modal.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { TableColumn, DropdownItem } from '../../../core/models/ui.model';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [RouterModule, CommonModule, Table, Button, Dropdown, Badge, Pagination],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class Portfolio implements OnInit, AfterViewInit {
  portfolios: any[] = [];
  isLoading = true;
  columns: TableColumn[] = [];

  // Pagination state
  currentPage = 1;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 18, 24];

  get paginatedPortfolios(): any[] {
    if (!this.portfolios || this.portfolios.length === 0) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.portfolios.slice(startIndex, startIndex + this.pageSize);
  }

  getSerialNumber(row: any): number {
    const index = this.portfolios.findIndex(p => p._id && row._id ? p._id === row._id : p === row);
    return index !== -1 ? index + 1 : this.portfolios.indexOf(row) + 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  @ViewChild('mediaTemplate', { static: true }) mediaTemplate!: TemplateRef<any>;
  @ViewChild('titleTemplate', { static: true }) titleTemplate!: TemplateRef<any>;
  @ViewChild('projectTypeTemplate', { static: true }) projectTypeTemplate!: TemplateRef<any>;
  @ViewChild('tagsTemplate', { static: true }) tagsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
  @ViewChild('snoTemplate', { static: true }) snoTemplate!: TemplateRef<any>;

  actionItems: DropdownItem[] = [
    { label: 'Edit', value: 'edit', icon: 'bi bi-pencil', className: 'text-primary' },
    { label: 'Delete', value: 'delete', icon: 'bi bi-trash', className: 'text-danger' }
  ];

  constructor(
    private portfolioService: PortfolioService,
    private modalService: ModalService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchPortfolios();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns = [
        { field: 'sno', headerName: 'S.NO', cellTemplate: this.snoTemplate, width: 70 },
        { field: 'media', headerName: 'MEDIA', cellTemplate: this.mediaTemplate, width: 120 },
        { field: 'title', headerName: 'TITLE', cellTemplate: this.titleTemplate, flexGrow: 1, minWidth: 250 },
        { field: 'projectType', headerName: 'PROJECT TYPE', cellTemplate: this.projectTypeTemplate, width: 150 },
        { field: 'tags', headerName: 'TAGS', cellTemplate: this.tagsTemplate, flexGrow: 1, minWidth: 200 },
        { field: 'actions', headerName: 'ACTIONS', cellTemplate: this.actionsTemplate, width: 100 }
      ];
    });
  }

  fetchPortfolios() {
    this.isLoading = true;
    this.portfolioService.getMyPortfolios().subscribe({
      next: (res) => {
        if (res.success) {
          this.portfolios = res.portfolios || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching portfolios', err);
        this.isLoading = false;
      }
    });
  }

  async deletePortfolio(id: string): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: 'Delete Portfolio Project',
      message: 'Are you sure you want to delete this portfolio project? This action cannot be undone.',
      confirmLabel: 'Delete',
      confirmVariant: 'danger',
      icon: 'bi bi-trash3',
      iconVariant: 'danger'
    });

    if (confirmed) {
      this.portfolioService.deletePortfolio(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.portfolios = this.portfolios.filter(p => p._id !== id);
            const maxPage = Math.max(1, Math.ceil(this.portfolios.length / this.pageSize));
            if (this.currentPage > maxPage) {
              this.currentPage = maxPage;
            }
            this.toastService.show('Portfolio project deleted successfully.', 'success');
          }
        },
        error: (err) => {
          console.error('Error deleting portfolio', err);
          this.toastService.show('Failed to delete portfolio project.', 'error');
        }
      });
    }
  }

  navigateToAdd() {
    this.router.navigate(['/create-portfolio']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/create-portfolio', id]);
  }
  getDropdownItems(row: any): DropdownItem[] {
    const items: DropdownItem[] = [
      { label: 'Edit', value: 'edit', icon: 'bi bi-pencil' },
      { label: 'Delete', value: 'delete', icon: 'bi bi-trash' }
    ];

    return items;
  }

  onDropdownAction(item: DropdownItem, row: any): void {

    switch (item.value) {
      case 'edit':
        this.navigateToEdit(row._id);
        break;
      case 'delete':
        this.deletePortfolio(row._id);
        break;
    }
  }
}
