import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Buttons } from '../../../components/buttons/buttons';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";

@Component({
  selector: 'app-seekers',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, Buttons, Table, Pagination],

  templateUrl: './seekers.html',
  styleUrl: './seekers.css',
})
export class Seekers implements OnInit{

  searchText = '';
selectedExperience = '';
selectedCategory = '';
selectedStatus = '';

filteredSeekers: any[] = [];
isFiltering = false;

experiences = ['0–1 Years', '1–2 Years', '2–3 Years', '3–5 Years', '5–8 Years', '8+ Years'];

categories = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Java Developer', 'Python Developer', 'Mobile Developer','DevOps Engineer','Data Analyst'];


statuses = ['Active', 'Inactive', 'Blocked'];

  @ViewChild('valueTemplate', { static: true })
  public valueTemplateRef!: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

  @ViewChild('imageTemplate', { static: true })
  public imageTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

  columns: any[] = [];

  page = 1;
limit = 5;
total = 0;

paginatedJobSeekers: any[] = [];

    constructor() {}

  ngOnInit() {
    this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Profile', template: this.imageTemplateRef },
      { name: 'Full Name', prop: 'name' },
      { name: 'Email', prop: 'email' },
      { name: 'Phone', prop: 'phone' },
       { name: 'Category', prop: 'category' },       // ✅ NEW
  { name: 'Experience', prop: 'experience' },   // ✅ NEW
      { name: 'Status', template: this.statusTemplateRef },
      { name: 'Action', template: this.actionsTemplateRef, center: true },
    ];
          this.total = this.seekers.length;
  this.applyPagination();

  }


applyPagination() {
  const source = this.isFiltering ? this.filteredSeekers : this.seekers;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedJobSeekers = source.slice(start, end);
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



seekers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@technova.com',
    phone: '9876543210',
    category: 'Frontend Developer',
    experience: '5–8 Years',
    status: 'Active',
    image: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 2,
    name: 'Anita Verma',
    email: 'anita@globalhire.com',
    phone: '9123456780',
    category: 'Backend Developer',
    experience: '3–5 Years',
    status: 'Active',
    image: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: 3,
    name: 'Vikram Singh',
    email: 'vikram@hirebridge.com',
    phone: '9988776655',
    category: 'Full Stack Developer',
    experience: '3–5 Years',
    status: 'Inactive',
    image: 'https://i.pravatar.cc/40?img=3',
  },
  {
    id: 4,
    name: 'Priya Reddy',
    email: 'priya@talentcore.com',
    phone: '9012345678',
    category: 'Java Developer',
    experience: '1–2 Years',
    status: 'Active',
    image: 'https://i.pravatar.cc/40?img=4',
  },
  {
    id: 5,
    name: 'Arjun Mehta',
    email: 'arjun@nextgenhire.com',
    phone: '9988123456',
    category: 'Python Developer',
    experience: '5–8 Years',
    status: 'Blocked',
    image: 'https://i.pravatar.cc/40?img=5',
  },
  {
    id: 6,
    name: 'Sneha Kapoor',
    email: 'sneha@brightjobs.com',
    phone: '9870012345',
    category: 'Mobile Developer',
    experience: '5–8 Years',
    status: 'Active',
    image: 'https://i.pravatar.cc/40?img=6',
  },
  {
    id: 7,
    name: 'Rohit Gupta',
    email: 'rohit@hirehub.com',
    phone: '9123009876',
    category: 'DevOps Engineer',
    experience: '2–3 Years',
    status: 'Inactive',
    image: 'https://i.pravatar.cc/40?img=7',
  },
  {
    id: 8,
    name: 'Neha Joshi',
    email: 'neha@workforcepro.com',
    phone: '9001122334',
    category: 'Data Analyst',
    experience: '3–5 Years',
    status: 'Active',
    image: 'https://i.pravatar.cc/40?img=8',
  },
  {
    id: 9,
    name: 'Karan Malhotra',
    email: 'karan@talentbridge.com',
    phone: '9887766554',
    category: 'Frontend Developer',
    experience: '3–5 Years',
    status: 'Blocked',
    image: 'https://i.pravatar.cc/40?img=9',
  },
  {
    id: 10,
    name: 'Pooja Nair',
    email: 'pooja@hrconnect.com',
    phone: '9765432109',
    category: 'Backend Developer',
    experience: '1–2 Years',
    status: 'Active',
    image: 'https://i.pravatar.cc/40?img=10',
  },
  {
    id: 11,
    name: 'Manish Yadav',
    email: 'manish@jobflow.com',
    phone: '9898989898',
    category: 'DevOps Engineer',
    experience: '5–8 Years',
    status: 'Inactive',
    image: 'https://i.pravatar.cc/40?img=11',
  },
  {
    id: 12,
    name: 'Divya Iyer',
    email: 'divya@peoplefirst.com',
    phone: '9876540001',
    category: 'Full Stack Developer',
    experience: '5–8 Years',
    status: 'Active',
    image: 'https://i.pravatar.cc/40?img=12',
  }
];

  onView(r: any) {
    console.log('View', r);
  }

  onBlock(r: any) {
    console.log('Block', r);
  }

  onUnblock(r: any) {
    console.log('Unblock', r);
  }

  onDeactivate(r: any) {
    console.log('Deactivate', r);
  }


applyFilters() {
  let data = [...this.seekers];

  if (this.searchText) {
    data = data.filter(s =>
      s.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCategory) {
    data = data.filter(s => s.category === this.selectedCategory);
  }

  if (this.selectedExperience) {
    data = data.filter(s => s.experience === this.selectedExperience);
  }

  if (this.selectedStatus) {
    data = data.filter(s => s.status === this.selectedStatus);
  }

  this.filteredSeekers = data;
  this.isFiltering = true;

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

mapExperience(position: string): string {
  if (position.toLowerCase().includes('manager')) return '5–8 Years';
  if (position.toLowerCase().includes('lead')) return '3–5 Years';
  if (position.toLowerCase().includes('senior')) return '3–5 Years';
  return '1–2 Years';
}


resetFilters() {
  this.searchText = '';
  this.selectedExperience = '';
  this.selectedCategory = '';
  this.selectedStatus = '';

  this.filteredSeekers = [];
  this.isFiltering = false;

  this.total = this.seekers.length;
  this.page = 1;

  this.applyPagination();
}


getActiveFilters(): { key: string; label: string }[] {
  const f: any[] = [];

  if (this.searchText) f.push({ key: 'search', label: this.searchText });
  if (this.selectedExperience) f.push({ key: 'experience', label: this.selectedExperience });
  if (this.selectedCategory) f.push({ key: 'category', label: this.selectedCategory });
  if (this.selectedStatus) f.push({ key: 'status', label: this.selectedStatus });

  return f;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'experience') this.selectedExperience = '';
  if (key === 'category') this.selectedCategory = '';
  if (key === 'status') this.selectedStatus = '';

  this.applyFilters();
}

}
