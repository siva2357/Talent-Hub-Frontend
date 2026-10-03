import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { RouterModule, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BlogService } from '../../../core/services/blog.service';
import { Table } from '../../../library/ui/components/table/table';
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { Button } from '../../../library/ui/components/button/button';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { InputOption, TableColumn } from '../../../core/models/ui.model';
import { Chip } from '../../../library/ui/components/chip/chip';
import {
  Dropdown,
  DropdownItem
} from '../../../library/ui/components/dropdown/dropdown';
import { Badge } from '../../../library/ui/components/badge/badge';
import { MasterDataService } from '../../../core/services/master-data.service';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription
} from 'rxjs';

import {
  map,
  debounceTime
} from 'rxjs/operators';

@Component({
  selector: 'app-blog-manager',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    Table,
    Pagination,
    Button,
    InputField,
    Chip,
    FormsModule,
    Dropdown,
    Badge
  ],
  providers: [DatePipe],
  templateUrl: './blog-manager.html',
  styleUrl: './blog-manager.css'
})
export class BlogManager
  implements OnInit, AfterViewInit, OnDestroy {

  isLoading = true;

  // =========================================================
  // TABLE TEMPLATES
  // =========================================================

  @ViewChild('mediaTpl')
  mediaTpl!: TemplateRef<any>;

  @ViewChild('titleTpl')
  titleTpl!: TemplateRef<any>;

  @ViewChild('categoryTpl')
  categoryTpl!: TemplateRef<any>;

  @ViewChild('createdTpl')
  createdTpl!: TemplateRef<any>;

  @ViewChild('actionsTpl')
  actionsTpl!: TemplateRef<any>;

  @ViewChild('indexTpl')
  indexTpl!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // =========================================================
  // REACTIVE STATE
  // =========================================================

  searchQuery$ = new BehaviorSubject<string>('');
  selectedCategory$ =
    new BehaviorSubject<string>('All Categories');

  rawBlogs$ =
    new BehaviorSubject<any[]>([]);

  currentPage$ =
    new BehaviorSubject<number>(1);

  pageSize$ =
    new BehaviorSubject<number>(10);

  // =========================================================
  // LOCAL FILTER STATE
  // =========================================================

  localSearchQuery = '';
  localSelectedCategory = 'All Categories';

  paginatedBlogs$!: Observable<any[]>;

  totalItems = 0;

  activeFilters: {
    key: string;
    label: string;
    value: any;
  }[] = [];

  categoryOptions: InputOption[] = [
    {
      label: 'All Categories',
      value: 'All Categories'
    }
  ];

  private sub?: Subscription;

  constructor(
    private blogService: BlogService,
    private masterDataService: MasterDataService,
    private router: Router
  ) { }

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    // -------------------------------------------------------
    // Fetch categories dynamically
    // -------------------------------------------------------

    this.masterDataService
      .getMasterDataByCategory('BlogCategories')
      .subscribe({
        next: (res) => {

          if (res.success && res.data) {

            const opts = res.data.map((opt: any) => ({
              label: opt.value,
              value: opt.key
            }));

            this.categoryOptions = [
              {
                label: 'All Categories',
                value: 'All Categories'
              },
              ...opts
            ];
          }
        },

        error: (err) => {
          console.error(
            'Error fetching blog categories',
            err
          );
        }
      });

    // -------------------------------------------------------
    // RxJS filter + pagination pipeline
    // -------------------------------------------------------

    this.paginatedBlogs$ = combineLatest([
      this.rawBlogs$,

      this.searchQuery$.pipe(
        debounceTime(300)
      ),

      this.selectedCategory$,
      this.currentPage$,
      this.pageSize$

    ]).pipe(

      map(
        ([
          rawBlogs,
          search,
          category,
          page,
          size
        ]) => {

          let filtered = [...rawBlogs];

          // Search
          if (search) {

            const q = search.toLowerCase();

            filtered = filtered.filter((blog) =>
              (blog.title &&
                blog.title
                  .toLowerCase()
                  .includes(q)) ||

              (blog.content &&
                blog.content
                  .toLowerCase()
                  .includes(q))
            );
          }

          // Category
          if (
            category &&
            category !== 'All Categories'
          ) {

            filtered = filtered.filter(
              (blog) =>
                blog.category === category
            );
          }

          // Total
          this.totalItems = filtered.length;

          // Active filters
          this.updateActiveFilters(
            search,
            category
          );

          // Pagination
          const start =
            (page - 1) * size;

          return filtered.slice(
            start,
            start + size
          );
        }
      )
    );

    // Fetch blogs
    this.fetchBlogs();
  }

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  ngAfterViewInit(): void {

    this.columns = [

      {
        field: 'index',
        headerName: 'S.No',
        cellTemplate: this.indexTpl,
        width: 60
      },

      {
        field: 'blogBanner',
        headerName: 'Media',
        cellTemplate: this.mediaTpl,
        width: 100
      },

      {
        field: 'title',
        headerName: 'Blog Title',
        cellTemplate: this.titleTpl,
        flexGrow: 1
      },

      {
        field: 'category',
        headerName: 'Category',
        cellTemplate: this.categoryTpl,
        width: 150
      },

      {
        field: 'createdAt',
        headerName: 'Created',
        cellTemplate: this.createdTpl,
        width: 150
      },

      {
        field: 'actions',
        headerName: 'Actions',
        cellTemplate: this.actionsTpl,
        width: 100
      }

    ];
  }

  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // =========================================================
  // FILTERS
  // =========================================================

  updateActiveFilters(
    search: string,
    category: string
  ): void {

    this.activeFilters = [];

    if (search) {

      this.activeFilters.push({
        key: 'search',
        label: `Search: ${search}`,
        value: search
      });
    }

    if (
      category &&
      category !== 'All Categories'
    ) {

      this.activeFilters.push({
        key: 'category',
        label: `Category: ${category}`,
        value: category
      });
    }
  }

  onSearchChange(val: string): void {
    this.localSearchQuery = val;
  }

  onCategoryChange(val: string): void {
    this.localSelectedCategory = val;
  }

  applyFilters(): void {

    this.searchQuery$.next(
      this.localSearchQuery
    );

    this.selectedCategory$.next(
      this.localSelectedCategory
    );

    this.currentPage$.next(1);
  }

  resetFilters(): void {

    this.localSearchQuery = '';
    this.localSelectedCategory =
      'All Categories';

    this.searchQuery$.next('');
    this.selectedCategory$.next(
      'All Categories'
    );

    this.currentPage$.next(1);
  }

  removeFilter(filter: any): void {

    if (filter.key === 'search') {

      this.localSearchQuery = '';
      this.searchQuery$.next('');
    }

    if (filter.key === 'category') {

      this.localSelectedCategory =
        'All Categories';

      this.selectedCategory$.next(
        'All Categories'
      );
    }

    this.currentPage$.next(1);
  }

  // =========================================================
  // PAGINATION
  // =========================================================

  onPageChange(page: number): void {
    this.currentPage$.next(page);
  }

  onPageSizeChange(size: number): void {

    this.pageSize$.next(size);
    this.currentPage$.next(1);
  }

  // =========================================================
  // BLOG API
  // =========================================================

  fetchBlogs(): void {

    this.isLoading = true;

    this.blogService
      .getAllBlogsAdmin()
      .subscribe({

        next: (res) => {

          if (res.success) {

            this.rawBlogs$.next(
              res.blogs || []
            );
          }

          this.isLoading = false;
        },

        error: (err) => {

          console.error(
            'Error fetching blogs',
            err
          );

          this.isLoading = false;
        }

      });
  }

  // =========================================================
  // DELETE
  // =========================================================

  deleteBlog(id: string): void {

    if (
      confirm(
        'Are you sure you want to delete this blog?'
      )
    ) {

      this.blogService
        .deleteBlog(id)
        .subscribe({

          next: (res) => {

            if (res.success) {

              const updated =
                this.rawBlogs$.value.filter(
                  (blog: any) =>
                    blog._id !== id
                );

              this.rawBlogs$.next(
                updated
              );
            }
          },

          error: (err) => {

            console.error(
              'Error deleting blog',
              err
            );
          }

        });
    }
  }

  // =========================================================
  // ACTIONS
  // =========================================================

  getActionItems(
    blog: any
  ): DropdownItem[] {

    return [
      {
        label: 'Edit',
        value: 'edit',
        icon: 'bi-pencil text-primary'
      },
      {
        label: 'Delete',
        value: 'delete',
        icon: 'bi-trash3 text-danger'
      }
    ];
  }

  onActionSelected(
    event: DropdownItem,
    blog: any
  ): void {

    if (event.value === 'edit') {

      this.router.navigate([
        '/edit-blog',
        blog._id
      ]);

    } else if (
      event.value === 'delete'
    ) {

      this.deleteBlog(blog._id);
    }
  }
}