import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { Table } from '../../../library/ui/components/table/table';
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { Button } from '../../../library/ui/components/button/button';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { InputOption, TableColumn } from '../../../core/models/ui.model';
import { Chip } from "../../../library/ui/components/chip/chip";
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';
import { Badge } from '../../../library/ui/components/badge/badge';
import { MasterDataService } from '../../../core/services/master-data.service';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-blog-manager',
  standalone: true,
  imports: [RouterModule, CommonModule, Table, Pagination, Button, InputField, Chip, FormsModule, Dropdown, Badge],
  providers: [DatePipe],
  templateUrl: './blog-manager.html',
  styleUrl: './blog-manager.css'
})
export class BlogManager implements OnInit, OnDestroy {
  isLoading = true;

  @ViewChild('mediaTpl', { static: true }) mediaTpl!: TemplateRef<any>;
  @ViewChild('titleTpl', { static: true }) titleTpl!: TemplateRef<any>;
  @ViewChild('categoryTpl', { static: true }) categoryTpl!: TemplateRef<any>;
  @ViewChild('createdTpl', { static: true }) createdTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;
  @ViewChild('indexTpl', { static: true }) indexTpl!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Reactive state
  searchQuery$ = new BehaviorSubject<string>('');
  selectedCategory$ = new BehaviorSubject<string>('All Categories');
  rawBlogs$ = new BehaviorSubject<any[]>([]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);

  // Local state for Apply button
  localSearchQuery = '';
  localSelectedCategory = 'All Categories';

  paginatedBlogs$!: Observable<any[]>;
  totalItems = 0;
  activeFilters: { key: string, label: string, value: any }[] = [];

  categoryOptions: InputOption[] = [
    { label: 'All Categories', value: 'All Categories' }
  ];

  private sub!: Subscription;

  constructor(
    private blogService: BlogService, 
    private masterDataService: MasterDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.columns = [
      { field: 'index', headerName: '#', cellTemplate: this.indexTpl, width: 60 },
      { field: 'featuredMedia', headerName: 'Media', cellTemplate: this.mediaTpl, width: 100 },
      { field: 'title', headerName: 'Blog Title', cellTemplate: this.titleTpl, flexGrow: 1 },
      { field: 'category', headerName: 'Category', cellTemplate: this.categoryTpl, width: 150 },
      { field: 'createdAt', headerName: 'Created', cellTemplate: this.createdTpl, width: 150 },
      { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl, width: 100 }
    ];
    
    // Fetch categories dynamically
    this.masterDataService.getMasterDataByCategory('BlogCategories').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const opts = res.data.map((opt: any) => ({
            label: opt.value, value: opt.key
          }));
          this.categoryOptions = [{ label: 'All Categories', value: 'All Categories' }, ...opts];
        }
      }
    });

    // RxJS Filter pipeline
    this.paginatedBlogs$ = combineLatest([
      this.rawBlogs$,
      this.searchQuery$.pipe(debounceTime(300)),
      this.selectedCategory$,
      this.currentPage$,
      this.pageSize$
    ]).pipe(
      map(([rawBlogs, search, category, page, size]) => {
        let filtered = [...rawBlogs];
        
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(b => 
            (b.title && b.title.toLowerCase().includes(q)) ||
            (b.content && b.content.toLowerCase().includes(q))
          );
        }

        if (category && category !== 'All Categories') {
          filtered = filtered.filter(b => b.category === category);
        }
        
        this.totalItems = filtered.length;
        this.updateActiveFilters(search, category);

        const start = (page - 1) * size;
        return filtered.slice(start, start + size);
      })
    );

    this.fetchBlogs();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  updateActiveFilters(search: string, category: string) {
    this.activeFilters = [];
    if (search) this.activeFilters.push({ key: 'search', label: `Search: ${search}`, value: search });
    if (category && category !== 'All Categories') this.activeFilters.push({ key: 'category', label: `Category: ${category}`, value: category });
  }

  onSearchChange(val: string) {
    this.localSearchQuery = val;
  }

  onCategoryChange(val: string) {
    this.localSelectedCategory = val;
  }

  applyFilters() {
    this.searchQuery$.next(this.localSearchQuery);
    this.selectedCategory$.next(this.localSelectedCategory);
    this.currentPage$.next(1);
  }

  resetFilters() {
    this.localSearchQuery = '';
    this.localSelectedCategory = 'All Categories';
    this.searchQuery$.next('');
    this.selectedCategory$.next('All Categories');
    this.currentPage$.next(1);
  }

  removeFilter(filter: any) {
    if (filter.key === 'search') {
      this.localSearchQuery = '';
      this.searchQuery$.next('');
    }
    if (filter.key === 'category') {
      this.localSelectedCategory = 'All Categories';
      this.selectedCategory$.next('All Categories');
    }
    this.currentPage$.next(1);
  }

  onPageChange(page: number) {
    this.currentPage$.next(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize$.next(size);
    this.currentPage$.next(1);
  }

  fetchBlogs() {
    this.isLoading = true;
    this.blogService.getAllBlogsAdmin().subscribe({
      next: (res) => {
        if (res.success) {
          this.rawBlogs$.next(res.blogs || []);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching blogs', err);
        this.isLoading = false;
      }
    });
  }

  deleteBlog(id: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: (res) => {
          if (res.success) {
            const updated = this.rawBlogs$.value.filter((b: any) => b._id !== id);
            this.rawBlogs$.next(updated);
          }
        },
        error: (err) => console.error('Error deleting blog', err)
      });
    }
  }

  getActionItems(blog: any): DropdownItem[] {
    return [
      { label: 'Edit', value: 'edit', icon: 'bi-pencil text-primary' },
      { label: 'Delete', value: 'delete', icon: 'bi-trash3 text-danger' }
    ];
  }

  onActionSelected(event: DropdownItem, blog: any) {
    if (event.value === 'edit') {
      this.router.navigate(['/edit-blog', blog._id]);
    } else if (event.value === 'delete') {
      this.deleteBlog(blog._id);
    }
  }
}
