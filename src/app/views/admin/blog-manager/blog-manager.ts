import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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

@Component({
  selector: 'app-blog-manager',
  standalone: true,
  imports: [RouterModule, CommonModule, Table, Pagination, Button, InputField, Chip, FormsModule, Dropdown, Badge],
  providers: [DatePipe],
  templateUrl: './blog-manager.html',
  styleUrl: './blog-manager.css'
})
export class BlogManager implements OnInit {
  blogs: any[] = [];
  rawBlogs: any[] = [];
  isLoading = true;

  @ViewChild('mediaTpl', { static: true }) mediaTpl!: TemplateRef<any>;
  @ViewChild('titleTpl', { static: true }) titleTpl!: TemplateRef<any>;
  @ViewChild('categoryTpl', { static: true }) categoryTpl!: TemplateRef<any>;
  @ViewChild('createdTpl', { static: true }) createdTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;
  @ViewChild('indexTpl', { static: true }) indexTpl!: TemplateRef<any>;

  columns: TableColumn[] = [];

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  searchQuery: string = '';
  selectedCategory: string = 'All Categories';
  activeFilters: { key: string, label: string, value: any }[] = [];

  categoryOptions: InputOption[] = [
    { label: 'All Categories', value: 'All Categories' },
    { label: 'Career', value: 'Career' },
    { label: 'Technology', value: 'Technology' }
  ];

  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit() {
    this.columns = [
      { field: 'index', headerName: '#', cellTemplate: this.indexTpl, width: 60 },
      { field: 'featuredMedia', headerName: 'Media', cellTemplate: this.mediaTpl, width: 100 },
      { field: 'title', headerName: 'Blog Title', cellTemplate: this.titleTpl, flexGrow: 1 },
      { field: 'category', headerName: 'Category', cellTemplate: this.categoryTpl, width: 150 },
      { field: 'createdAt', headerName: 'Created', cellTemplate: this.createdTpl, width: 150 },
      { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl, width: 100 }
    ];
    this.fetchBlogs();
  }

  applyFilters() {
    this.activeFilters = [];
    if (this.searchQuery) {
      this.activeFilters.push({ key: 'search', label: `Search: ${this.searchQuery}`, value: this.searchQuery });
    }
    if (this.selectedCategory && this.selectedCategory !== 'All Categories') {
      this.activeFilters.push({ key: 'category', label: `Category: ${this.selectedCategory}`, value: this.selectedCategory });
    }

    let filtered = [...this.rawBlogs];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q))
      );
    }

    if (this.selectedCategory && this.selectedCategory !== 'All Categories') {
      filtered = filtered.filter(b => b.category === this.selectedCategory);
    }

    this.blogs = filtered;
    this.totalItems = this.blogs.length;
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'All Categories';
    this.applyFilters();
  }

  removeFilter(filter: any) {
    if (filter.key === 'search') this.searchQuery = '';
    if (filter.key === 'category') this.selectedCategory = 'All Categories';
    this.applyFilters();
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
  }

  fetchBlogs() {
    this.isLoading = true;
    this.blogService.getAllBlogsAdmin().subscribe({
      next: (res) => {
        if (res.success) {
          this.rawBlogs = res.blogs || [];
          this.applyFilters();
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
            this.rawBlogs = this.rawBlogs.filter(b => b._id !== id);
            this.applyFilters();
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

