import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { Table } from '../../../library/ui/components/table/table';
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { Button } from '../../../library/ui/components/button/button';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { InputOption, TableColumn } from '../../../core/models/ui.model';

@Component({
  selector: 'app-blog-manager',
  standalone: true,
  imports: [RouterModule, CommonModule, Table, Pagination, Button, InputField],
  providers: [DatePipe],
  templateUrl: './blog-manager.html',
  styleUrl: './blog-manager.css'
})
export class BlogManager implements OnInit {
  blogs: any[] = [];
  isLoading = true;

  @ViewChild('mediaTpl', { static: true }) mediaTpl!: TemplateRef<any>;
  @ViewChild('titleTpl', { static: true }) titleTpl!: TemplateRef<any>;
  @ViewChild('categoryTpl', { static: true }) categoryTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('createdTpl', { static: true }) createdTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;
  @ViewChild('indexTpl', { static: true }) indexTpl!: TemplateRef<any>;

  columns: TableColumn[] = [];

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  categoryOptions: InputOption[] = [
    { label: 'Category', value: '' },
    { label: 'Career', value: 'Career' },
    { label: 'Technology', value: 'Technology' }
  ];

  statusOptions: InputOption[] = [
    { label: 'Status', value: '' },
    { label: 'Published', value: 'Published' },
    { label: 'Draft', value: 'Draft' }
  ];

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.columns = [
      { field: 'index', headerName: '#', cellTemplate: this.indexTpl, width: 60 },
      { field: 'featuredMedia', headerName: 'Media', cellTemplate: this.mediaTpl, width: 100 },
      { field: 'title', headerName: 'Blog Title', cellTemplate: this.titleTpl, flexGrow: 1 },
      { field: 'category', headerName: 'Category', cellTemplate: this.categoryTpl, width: 150 },
      { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl, width: 150 },
      { field: 'createdAt', headerName: 'Created', cellTemplate: this.createdTpl, width: 150 },
      { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl, width: 100 }
    ];
    this.fetchBlogs();
  }

  applyFilters() {
    // Empty function for now as requested
  }

  resetFilters() {
    // Empty function for now as requested
  }

  onPageChange(page: number) {
    this.currentPage = page;
    // Fetch data for new page
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    // Fetch data for new page size
  }

  fetchBlogs() {
    this.isLoading = true;
    this.blogService.getAllBlogsAdmin().subscribe({
      next: (res) => {
        if (res.success) {
          this.blogs = res.blogs || [];
          this.totalItems = this.blogs.length; // Mock total items for pagination
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
            this.blogs = this.blogs.filter(b => b._id !== id);
          }
        },
        error: (err) => console.error('Error deleting blog', err)
      });
    }
  }
}

