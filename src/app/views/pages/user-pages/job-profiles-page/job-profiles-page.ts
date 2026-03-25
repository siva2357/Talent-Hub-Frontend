import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pagination } from "../../../components/pagination/pagination";
import { Buttons } from "../../../components/buttons/buttons";

@Component({
  selector: 'app-job-profiles-page',
  imports: [RouterModule, FormsModule, CommonModule, Pagination, Buttons],
  templateUrl: './job-profiles-page.html',
  styleUrl: './job-profiles-page.css',
})
export class JobProfilesPage implements OnInit {

categories = ['Frontend', 'Backend', 'Full Stack', 'Data Science'];
jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
locations = [ 'Hyderabad', 'Bangalore', 'Chennai','Mumbai','Delhi','Pune','Kolkata','Ahmedabad','Noida','Gurgaon','Remote'];
searchText = '';
selectedCategory = '';
selectedJobtype = '';
selectedLocation = '';



  loading = false;
  error = '';

  constructor(private jobService: JobpostService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

jobs: any[] = [];
  page = 1;
limit = 5;
total = 0;
filteredJobPosts: any[] = [];
paginatedJobPosts: any[] = [];
isFiltering = false;


loadJobs() {
  this.jobService.getAllJobPosts().subscribe({
    next: (res: any) => {
      this.jobs = res.jobs || [];
      this.total = this.jobs.length;

      this.markSavedJobs(); // pagination handled inside now
    },
    error: (err) => {
      console.error("Error fetching jobs:", err);
    }
  });
}



markSavedJobs() {
  this.jobService.getSavedJobPosts().subscribe({
    next: (res: any) => {

      const savedIds = res.savedJobIds;

      this.jobs = this.jobs.map(job => ({
        ...job,
        isSaved: savedIds.includes(job._id)
      }));

      // ✅ FIX: apply pagination AFTER marking
      this.applyPagination();
    },
    error: (err) => console.error(err)
  });
}



toggleSave(job: any) {

  if (job.isSaved) {
    // 🔴 UNSAVE
    this.jobService.unsaveJobPost(job._id).subscribe({
      next: () => {
        job.isSaved = false;
      },
      error: (err) => console.error(err)
    });

  } else {
    // 🟢 SAVE
    this.jobService.saveJobPost(job._id).subscribe({
      next: () => {
        job.isSaved = true;
      },
      error: (err) => console.error(err)
    });
  }

}



applyFilters() {
  let data = [...this.jobs];

  if (this.searchText) {
    data = data.filter(c =>
      c.title?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCategory) {
    data = data.filter(c => c.category === this.selectedCategory);
  }

  if (this.selectedJobtype) {
    data = data.filter(c => c.type === this.selectedJobtype);
  }

  if (this.selectedLocation) {
    data = data.filter(c => c.location === this.selectedLocation);
  }

  this.filteredJobPosts = [...data]; // 🔥 FIX
  this.isFiltering = true;

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

resetFilters() {
  this.searchText = '';
  this.selectedCategory = '';
  this.selectedJobtype = '';
  this.selectedLocation = '';

  this.filteredJobPosts = [];
  this.isFiltering = false; // ✅ important

  this.total = this.jobs.length;
  this.page = 1;

  this.applyPagination();
}


getActiveFilters(): { key: string; label: string }[] {
  const filters: { key: string; label: string }[] = [];

  if (this.searchText) {
    filters.push({ key: 'search', label: this.searchText });
  }

  if (this.selectedCategory ) {
    filters.push({ key: 'category', label: this.selectedCategory  });
  }

  if (this.selectedJobtype) {
    filters.push({ key: 'type', label: this.selectedJobtype });
  }

  if (this.selectedLocation) {
    filters.push({ key: 'location', label: this.selectedLocation });
  }

  return filters;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'category') this.selectedCategory = '';
  if (key === 'type') this.selectedJobtype = '';
  if (key === 'location') this.selectedLocation = '';
  this.applyFilters(); // re-run filtering
}



applyPagination() {
  const source = this.isFiltering
    ? this.filteredJobPosts
    : this.jobs;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedJobPosts = source.slice(start, end).map((item, index) => ({
    ...item,
    sno: start + index + 1
  }));
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


}
