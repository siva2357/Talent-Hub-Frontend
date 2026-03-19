import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";
import { Buttons } from "../../../components/buttons/buttons";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-page',
  imports: [CommonModule, Table, Pagination, Buttons,FormsModule],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
})
export class BlogPage  implements OnInit {
  // -------------------------
  // PAGINATION STATE
  // -------------------------
  page = 1;
  limit = 5;
  total = 0;

  paginatedBlogs: any[] = [];

categories = ['Industry News', 'Interview Tips', 'Recruitment', 'Career', 'Technology'];
statuses = ['Draft', 'Published', 'Archived'];
searchText = '';
selectedCategory = '';
selectedStatus = '';


selectedDate = '';
filteredBlogs: any[] = [];

  @ViewChild('valueTemplate', { static: true })
  public valueTemplateRef!: TemplateRef<any>;

  @ViewChild('categoryTemplate', { static: true })
  public categoryTemplateRef!: TemplateRef<any>;

  @ViewChild('imageTemplate', { static: true })
  public imageTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

  columns: any[] = [];



isFiltering = false;


  constructor() {}

  ngOnInit() {
    this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Image', template: this.imageTemplateRef },
      { name: 'Title', prop: 'title' },
      { name: 'Category',  template: this.categoryTemplateRef  },
      { name: 'Posted Date', prop: 'postedDate' },
      { name: 'Action', template: this.actionsTemplateRef, center: true },
    ];

        this.total = this.blogs.length;
    this.applyPagination();

  }


    // -------------------------
  // PAGINATION LOGIC
  // -------------------------
applyPagination() {
  const source = this.isFiltering ? this.filteredBlogs : this.blogs;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedBlogs = source.slice(start, end);
}

  onPageChange(p: number) {
    this.page = p;
    this.applyPagination();
  }

  onLimitChange(l: number) {
    this.limit = l;
    this.page = 1;
    this.applyPagination();
  }






  blogs = [
  {
    id: 1,
    title: 'How AI is Changing Recruitment',
    category: 'Technology',
     postedDate: '2026-03-10',
     status: 'Published',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80'
  },
  {
    id: 2,
    title: 'Top 10 Resume Tips',
    category: 'Career',
    postedDate: '2026-03-08',
    status: 'Archived',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80'
  }
];



onView(blog: any) {
  console.log('View:', blog);
}

onEdit(blog: any) {
  console.log('Edit:', blog);
}

onDelete(blog: any) {
  console.log('Delete:', blog);
}



filteredCompanies: any[] = [];

applyFilters() {
  let data = [...this.blogs];

  if (this.searchText) {
    data = data.filter(b =>
      b.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCategory) {
    data = data.filter(b => b.category === this.selectedCategory);
  }

    if (this.selectedStatus) {
    data = data.filter(b => b.status === this.selectedStatus);
  }

  if (this.selectedDate) {
    data = data.filter(b => b.postedDate === this.selectedDate);
  }

  this.filteredBlogs = data;
  this.isFiltering = true;

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

resetFilters() {
  this.searchText = '';
  this.selectedCategory = '';
  this.selectedStatus = '';
  this.selectedDate = '';

  this.filteredBlogs = [];
  this.isFiltering = false;

  this.total = this.blogs.length;
  this.page = 1;

  this.applyPagination();
}



getActiveFilters(): { key: string; label: string }[] {
  const filters: any[] = [];

  if (this.searchText) filters.push({ key: 'search', label: this.searchText });
  if (this.selectedCategory) filters.push({ key: 'category', label: this.selectedCategory });
  if (this.selectedStatus) filters.push({ key: 'status', label: this.selectedStatus });
  if (this.selectedDate) filters.push({ key: 'date', label: this.selectedDate });

  return filters;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'category') this.selectedCategory = '';
  if (key === 'status') this.selectedStatus = '';
  if (key === 'date') this.selectedDate = '';

  this.applyFilters();
}
}
