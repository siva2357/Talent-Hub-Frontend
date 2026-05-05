import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Buttons } from "../../../components/buttons/buttons";
import { InputFields } from "../../../components/input-fields/input-fields";

@Component({
  selector: 'app-job-profiles-page',
  imports: [RouterModule, FormsModule, CommonModule, Buttons, InputFields],
  templateUrl: './job-profiles-page.html',
  styleUrl: './job-profiles-page.css',
})
export class JobProfilesPage implements OnInit {

  categories = ['Frontend', 'Backend', 'Full Stack', 'Data Science'];
  jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
  locations = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad', 'Noida', 'Gurgaon', 'Remote'];
  
  searchText = '';
  selectedCategory = '';
  selectedJobtype = '';
  selectedLocation = '';

  appliedFilters: any = {
    search: '',
    category: '',
    type: '',
    location: ''
  };

  loading = false;
  initialLoaded = false;
  error = '';

  allJobs: any[] = [];
  filteredJobs: any[] = [];
  displayJobs: any[] = [];

  page = 1;
  limit = 9;
  hasMore = true;

  constructor(private jobService: JobpostService) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    if (this.loading) return;
    this.loading = true;

    this.jobService.getAllJobPosts().subscribe({
      next: (res: any) => {
        this.allJobs = res.jobs || [];
        this.filteredJobs = [...this.allJobs];
        
        this.updateDisplayJobs(true);
        this.initialLoaded = true;
        this.markSavedJobs();
      },
      error: (err) => {
        console.error("Error fetching jobs:", err);
        this.loading = false;
        this.initialLoaded = true;
      }
    });
  }

  markSavedJobs() {
    this.jobService.getSavedJobPosts().subscribe({
      next: (res: any) => {
        const savedIds = res.savedJobIds || [];
        
        const sync = (list: any[]) => list.map(job => ({
          ...job,
          isSaved: savedIds.includes(job._id)
        }));

        this.allJobs = sync(this.allJobs);
        this.filteredJobs = sync(this.filteredJobs);
        this.displayJobs = sync(this.displayJobs);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleSave(job: any) {
    if (job.isSaved) {
      this.jobService.unsaveJobPost(job._id).subscribe({
        next: () => job.isSaved = false,
        error: (err) => console.error(err)
      });
    } else {
      this.jobService.saveJobPost(job._id).subscribe({
        next: () => job.isSaved = true,
        error: (err) => console.error(err)
      });
    }
  }

  // Authoritative Display Engine
  updateDisplayJobs(reset: boolean = false) {
    if (reset) {
      this.page = 1;
    }
    const end = this.page * this.limit;
    this.displayJobs = this.filteredJobs.slice(0, end);
    this.hasMore = end < this.filteredJobs.length;
  }

  // Manual filtering
  applyFilters() {
    // Commit draft to applied state
    this.appliedFilters.search = this.searchText;
    this.appliedFilters.category = this.selectedCategory;
    this.appliedFilters.type = this.selectedJobtype;
    this.appliedFilters.location = this.selectedLocation;

    let data = [...this.allJobs];

    if (this.appliedFilters.search) {
      const search = this.appliedFilters.search.toLowerCase();
      data = data.filter(c =>
        c.title?.toLowerCase().includes(search) ||
        c.company?.toLowerCase().includes(search)
      );
    }

    if (this.appliedFilters.category) {
      data = data.filter(c => c.category === this.appliedFilters.category);
    }

    if (this.appliedFilters.type) {
      data = data.filter(c => c.type === this.appliedFilters.type);
    }

    if (this.appliedFilters.location) {
      data = data.filter(c => c.location === this.appliedFilters.location);
    }

    this.filteredJobs = data;
    this.updateDisplayJobs(true);
  }

  loadMore() {
    if (this.hasMore && !this.loading) {
      this.page++;
      this.updateDisplayJobs(false);
    }
  }

  resetFilters() {
    this.searchText = '';
    this.selectedCategory = '';
    this.selectedJobtype = '';
    this.selectedLocation = '';
    this.appliedFilters = { search: '', category: '', type: '', location: '' };
    this.filteredJobs = [...this.allJobs];
    this.updateDisplayJobs(true);
  }

  resetPagination() {
    this.page = 1;
    this.hasMore = true;
  }

  getActiveFilters(): { key: string; label: string }[] {
    const filters: { key: string; label: string }[] = [];
    if (this.appliedFilters.search) filters.push({ key: 'search', label: this.appliedFilters.search });
    if (this.appliedFilters.category) filters.push({ key: 'category', label: this.appliedFilters.category });
    if (this.appliedFilters.type) filters.push({ key: 'type', label: this.appliedFilters.type });
    if (this.appliedFilters.location) filters.push({ key: 'location', label: this.appliedFilters.location });
    return filters;
  }

  removeFilter(key: string) {
    if (key === 'search') this.searchText = this.appliedFilters.search = '';
    if (key === 'category') this.selectedCategory = this.appliedFilters.category = '';
    if (key === 'type') this.selectedJobtype = this.appliedFilters.type = '';
    if (key === 'location') this.selectedLocation = this.appliedFilters.location = '';
    this.applyFilters(); // Re-filter after removing chip
  }
}
