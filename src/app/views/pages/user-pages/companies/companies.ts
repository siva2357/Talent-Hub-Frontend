import { Component, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";
import { Buttons } from "../../../components/buttons/buttons";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, Table, Pagination, Buttons,FormsModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies {

  locations = ['India', 'United States', 'United Kingdom', 'Remote'];

industries = ['Software', 'Finance', 'Healthcare', 'Education', 'E-commerce'];

statuses = ['Active', 'Inactive', 'Blocked'];

searchText = '';
selectedLocation = '';
selectedIndustry = '';
selectedStatus = '';


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

paginatedCompanies: any[] = [];
isFiltering = false;

  constructor() {}

  ngOnInit() {
    this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Logo', template: this.imageTemplateRef },
      { name: 'Company Name', prop: 'name' },
      { name: 'Email', prop: 'email' },
      { name: 'Phone', prop: 'phone' },
      { name: 'Location', prop: 'location' },
      { name: 'Industry', prop: 'industry' },
      { name: 'Status', template: this.statusTemplateRef },
      { name: 'Action', template: this.actionsTemplateRef, center: true },
    ];
          this.total = this.companies.length;
  this.applyPagination();
  }


applyPagination() {
  const source = this.filteredCompanies.length || this.isFiltering
    ? this.filteredCompanies
    : this.companies;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedCompanies = source.slice(start, end);
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



  companies = [
  {
    id: 1,
    name: 'TechNova Pvt Ltd',
    email: 'contact@technova.com',
    phone: '+91 9876543210',
    location: 'Hyderabad',
    industry: 'Software',
    status: 'Active',
    logo: 'https://ui-avatars.com/api/?name=TechNova&background=0D8ABC&color=fff'
  },
  {
    id: 2,
    name: 'GlobalHire Solutions',
    email: 'info@globalhire.com',
    phone: '+91 9123456780',
    location: 'Bangalore',
    industry: 'Recruitment',
    status: 'Active',
    logo: 'https://ui-avatars.com/api/?name=GlobalHire&background=20c997&color=fff'
  },
  {
    id: 3,
    name: 'HireBridge',
    email: 'contact@hirebridge.com',
    phone: '+91 9988776655',
    location: 'Pune',
    industry: 'HR Services',
    status: 'Inactive',
    logo: 'https://ui-avatars.com/api/?name=HireBridge&background=6f42c1&color=fff'
  },
  {
    id: 4,
    name: 'TalentForge',
    email: 'support@talentforge.com',
    phone: '+91 9898989898',
    location: 'Mumbai',
    industry: 'Consulting',
    status: 'Active',
    logo: 'https://ui-avatars.com/api/?name=TalentForge&background=fd7e14&color=fff'
  },
  {
    id: 5,
    name: 'NextStep Careers',
    email: 'hr@nextstep.com',
    phone: '+91 9001122334',
    location: 'Chennai',
    industry: 'Technology',
    status: 'Active',
    logo: 'https://ui-avatars.com/api/?name=NextStep&background=198754&color=fff'
  },
  {
    id: 6,
    name: 'CareerPath',
    email: 'contact@careerpath.com',
    phone: '+91 9012345678',
    location: 'Delhi',
    industry: 'Education',
    status: 'Inactive',
    logo: 'https://ui-avatars.com/api/?name=CareerPath&background=dc3545&color=fff'
  },
  {
    id: 7,
    name: 'BrightHire',
    email: 'info@brighthire.com',
    phone: '+91 8887766554',
    location: 'Gurgaon',
    industry: 'Recruitment',
    status: 'Active',
    logo: 'https://ui-avatars.com/api/?name=BrightHire&background=0dcaf0&color=fff'
  },
  {
    id: 8,
    name: 'TalentLink',
    email: 'support@talentlink.com',
    phone: '+91 9112233445',
    location: 'Hyderabad',
    industry: 'IT Services',
    status: 'Active',
    logo: 'https://ui-avatars.com/api/?name=TalentLink&background=6610f2&color=fff'
  },
  {
    id: 9,
    name: 'FutureJobs',
    email: 'contact@futurejobs.com',
    phone: '+91 9223344556',
    location: 'Bangalore',
    industry: 'Technology',
    status: 'Active',
    logo: 'https://ui-avatars.com/api/?name=FutureJobs&background=ffc107&color=000'
  },
  {
    id: 10,
    name: 'Elite Recruiters',
    email: 'info@elite.com',
    phone: '+91 9334455667',
    location: 'Mumbai',
    industry: 'HR Consulting',
    status: 'Inactive',
    logo: 'https://ui-avatars.com/api/?name=EliteRecruiters&background=343a40&color=fff'
  }
];


filteredCompanies: any[] = [];

applyFilters() {
  let data = [...this.companies];

  if (this.searchText) {
    data = data.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedLocation) {
    data = data.filter(c => c.location === this.selectedLocation);
  }

  if (this.selectedIndustry) {
    data = data.filter(c => c.industry === this.selectedIndustry);
  }

  if (this.selectedStatus) {
    data = data.filter(c => c.status === this.selectedStatus);
  }

  this.filteredCompanies = data;
  this.isFiltering = true;   // ✅ important

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

resetFilters() {
  this.searchText = '';
  this.selectedLocation = '';
  this.selectedIndustry = '';
  this.selectedStatus = '';

  this.filteredCompanies = [];
  this.isFiltering = false; // ✅ important

  this.total = this.companies.length;
  this.page = 1;

  this.applyPagination();
}



getActiveFilters(): { key: string; label: string }[] {
  const filters: { key: string; label: string }[] = [];

  if (this.searchText) {
    filters.push({ key: 'search', label: this.searchText });
  }

  if (this.selectedLocation) {
    filters.push({ key: 'location', label: this.selectedLocation });
  }

  if (this.selectedIndustry) {
    filters.push({ key: 'industry', label: this.selectedIndustry });
  }

  if (this.selectedStatus) {
    filters.push({ key: 'status', label: this.selectedStatus });
  }

  return filters;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'location') this.selectedLocation = '';
  if (key === 'industry') this.selectedIndustry = '';
  if (key === 'status') this.selectedStatus = '';
  this.applyFilters(); // re-run filtering
}

}
