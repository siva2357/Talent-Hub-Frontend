import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Loader } from '../../../library/ui/components/loader/loader';
import { JobCard } from '../../../library/shared/components/job-card/job-card';
import { JobCardData } from '../../../core/models/job.model';
import { STATIC_WORKSPHERE_JOBS } from '../find-jobs-page/find-jobs-page';

@Component({
  selector: 'app-saved-jobs-page',
  standalone: true,
  imports: [CommonModule, InputField, Chip, Button, Loader, JobCard],
  templateUrl: './saved-jobs-page.html',
  styleUrl: './saved-jobs-page.css'
})
export class SavedJobsPage implements OnInit {
  savedJobsList: JobCardData[] = [];
  filteredSavedJobs: JobCardData[] = [];
  isLoading: boolean = false;
  actionMessage: string | null = null;

  searchQuery: string = '';
  selectedDepartment: string = 'all';
  selectedWorkMode: string = 'all';

  departmentOptions: InputOption[] = [
    { label: 'All Departments', value: 'all' },
    { label: 'Product Engineering', value: 'Product Engineering' },
    { label: 'Cloud Infrastructure', value: 'Cloud Infrastructure' },
    { label: 'Digital Banking', value: 'Digital Banking' },
    { label: 'Applied AI', value: 'Applied AI' },
    { label: 'Design Engineering', value: 'Design Engineering' },
    { label: 'Connected Health', value: 'Connected Health' }
  ];

  workModeOptions: InputOption[] = [
    { label: 'All Work Modes', value: 'all' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'On-site', value: 'On-site' }
  ];

  activeFilters: string[] = ['Bookmarked Roles', 'Worksphere Verified'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load bookmarked jobs from static Worksphere jobs
    this.savedJobsList = STATIC_WORKSPHERE_JOBS
      .filter(j => j.hasSaved)
      .map(j => ({ ...j }));
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredSavedJobs = this.savedJobsList.filter(job => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        job.jobTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesDept =
        this.selectedDepartment === 'all' || job.department === this.selectedDepartment;

      const matchesMode =
        this.selectedWorkMode === 'all' || job.workMode === this.selectedWorkMode;

      return matchesSearch && matchesDept && matchesMode;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedDepartment = 'all';
    this.selectedWorkMode = 'all';
    this.activeFilters = ['Bookmarked Roles', 'Worksphere Verified'];
    this.applyFilters();
  }

  removeFilter(filterToRemove: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filterToRemove);
  }

  onUnsaveJob(job: JobCardData): void {
    job.hasSaved = false;
    this.savedJobsList = this.savedJobsList.filter(j => j._id !== job._id);
    this.applyFilters();
    this.actionMessage = `Removed "${job.jobTitle}" at ${job.companyName} from your Saved Jobs.`;
  }

  viewDetails(job: JobCardData): void {
    this.router.navigate(['/job-details', job._id]);
  }
}
