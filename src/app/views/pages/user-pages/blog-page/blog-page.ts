import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../components/table/table';
import { Pagination } from '../../../components/pagination/pagination';
import { InputFields } from '../../../components/input-fields/input-fields';
import { Buttons } from '../../../components/buttons/buttons';

interface Blog {
  _id: number;
  media: string;
  title: string;
  category: string;
  tags: string[];
  postedDate: string;
}

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, Table, Pagination, InputFields, Buttons],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
})
export class BlogPage implements OnInit {

  @ViewChild('mediaTpl', { static: true }) mediaTpl!: TemplateRef<any>;
  @ViewChild('tagsTpl', { static: true }) tagsTpl!: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;

  columns: any[] = [];
  allData: Blog[] = [];
  data: Blog[] = [];

  page = 1;
  limit = 5;
  total = 0;

  // ✅ FIXED FILTERS (blog-based)
  filters = { title: '', category: '' };
  appliedFilters = { title: '', category: '' };

  ngOnInit() {
    // ✅ DUMMY DATA
    this.allData = Array.from({ length: 20 }, (_, i): Blog => ({
      _id: i + 1,
      media: `https://picsum.photos/seed/${i}/60/60`,
      title: `Blog Title ${i + 1}`,
      category: i % 2 === 0 ? 'Technology' : 'Design',
      tags: ['Angular', 'UI', 'Tips'].slice(0, (i % 3) + 1),
      postedDate: new Date(2024, i % 12, i + 1).toDateString()
    }));

    this.total = this.allData.length;

    // ✅ TABLE COLUMNS
    this.columns = [
      { name: 'S.No', type: 'index', center: true, width: '60px' },
      { name: 'Media', template: this.mediaTpl, width: '100px' },
      { name: 'Title', prop: 'title', width: '200px' },
      { name: 'Category', prop: 'category', width: '150px' },
      { name: 'Tags', template: this.tagsTpl, width: '200px' },
      { name: 'Posted Date', prop: 'postedDate', width: '150px' },
      { name: 'Actions', template: this.actionTpl, center: true, width: '220px' }
    ];

    this.applyFilter();
  }

  applyFilter() {
    let filtered = [...this.allData];

    // ✅ TITLE FILTER
    if (this.appliedFilters.title) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(this.appliedFilters.title.toLowerCase())
      );
    }

    // ✅ CATEGORY FILTER
    if (this.appliedFilters.category) {
      filtered = filtered.filter(b =>
        b.category.toLowerCase().includes(this.appliedFilters.category.toLowerCase())
      );
    }

    this.total = filtered.length;

    // ✅ PAGE SAFETY
    const maxPage = Math.ceil(this.total / this.limit) || 1;
    if (this.page > maxPage) {
      this.page = maxPage;
    }

    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.data = filtered.slice(start, end);
  }

  onApplyFilters() {
    this.appliedFilters = { ...this.filters };
    this.page = 1;
    this.applyFilter();
  }

  onResetFilters() {
    this.filters = { title: '', category: '' };
    this.appliedFilters = { title: '', category: '' };
    this.page = 1;
    this.applyFilter();
  }

  removeFilter(type: 'title' | 'category') {
    this.filters[type] = '';
    this.appliedFilters[type] = '';
    this.page = 1;
    this.applyFilter();
  }

  onPageChange(p: number) {
    this.page = p;
    this.applyFilter();
  }

  onLimitChange(l: number) {
    this.limit = l;
    this.page = 1;
    this.applyFilter();
  }

  // ✅ ACTIONS
  viewBlog(row: Blog) {
    console.log('View', row);
  }

  editBlog(row: Blog) {
    console.log('Edit', row);
  }

  deleteBlog(row: Blog) {
    if (confirm(`Delete ${row.title}?`)) {
      console.log('Delete', row);
    }
  }
}
