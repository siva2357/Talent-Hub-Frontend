import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, ChipComponent, TitleCasePipe, FormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
})
export class ProfileFormComponent implements AfterViewInit, OnDestroy {
  userRole: 'freelancer' | 'client' = 'freelancer';
  activeSection: string = 'basic';
  progress: number = 0;
  isProfessionalDropdownOpen: boolean = false;
  private observer: IntersectionObserver | null = null;

  // PREFILLED DATA
  prefilledData = {
    fullName: 'Siva Prasad',
    email: 'siva.prasad@example.com'
  };

  // FORM SELECTIONS
  experienceLevel: string = 'beginner';
  availabilityType: string = '';
  clientType: string = '';
  hiringType: string = 'long-term';
  gender: string = '';

  savedSocialLinks: any[] = [];
  currentLink = { platform: '', url: '' };

  isEditModalOpen: boolean = false;
  editingLinkIndex: number = -1;
  editingLinkData = { platform: '', url: '' };

  platformOptions = [
    { label: 'LinkedIn', value: 'linkedin', icon: 'bi-linkedin' },
    { label: 'Twitter / X', value: 'twitter', icon: 'bi-twitter-x' },
    { label: 'GitHub', value: 'github', icon: 'bi-github' },
    { label: 'Portfolio', value: 'portfolio', icon: 'bi-link-45deg' },
    { label: 'Dribbble', value: 'dribbble', icon: 'bi-dribbble' },
    { label: 'Behance', value: 'behance', icon: 'bi-behance' }
  ];

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  availabilityOptions = [
    { label: 'Full Time', value: 'full-time' },
    { label: 'Part Time', value: 'part-time' },
    { label: 'Other', value: 'other' }
  ];

  // SECTIONS DEFINITIONS
  freelancerSections = [
    { id: 'basic', label: 'Basic Identity', sub: 'Tell us who you are', icon: 'bi-person' },
    { id: 'professional', label: 'Professional Details', sub: 'Your work & expertise', icon: 'bi-briefcase' },
    { id: 'location', label: 'Location', sub: 'Where are you based?', icon: 'bi-geo-alt' },
    { id: 'availability', label: 'Availability', sub: 'When you can work', icon: 'bi-clock' },
    { id: 'verification', label: 'Verification', sub: 'Verify your contact', icon: 'bi-shield-check' },
    { id: 'social', label: 'Social & Links', sub: 'Your portfolio & profiles', icon: 'bi-link-45deg' },
  ];

  clientSections = [
    { id: 'basic', label: 'Basic Information', sub: 'Tell us about yourself', icon: 'bi-person' },
    { id: 'professional', label: 'Professional Details', sub: 'Your business details', icon: 'bi-briefcase' },
    { id: 'location', label: 'Location', sub: 'Where are you based?', icon: 'bi-geo-alt' },
    { id: 'verification', label: 'Verification', sub: 'Verify your contact details', icon: 'bi-shield-check' },
    { id: 'social', label: 'Social Links', sub: 'Add your social profiles', icon: 'bi-link-45deg' },
  ];

  industryOptions = [
    { label: 'Technology', value: 'tech' },
    { label: 'Healthcare', value: 'health' },
    { label: 'Finance', value: 'finance' },
    { label: 'Education', value: 'edu' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Design', value: 'design' },
    { label: 'Other', value: 'other' }
  ];

  countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'India', value: 'IN' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' }
  ];

  timezoneOptions = [
    { label: '(GMT-05:00) Eastern Time', value: 'ET' },
    { label: '(GMT-08:00) Pacific Time', value: 'PT' },
    { label: '(GMT+05:30) India Standard Time', value: 'IST' },
    { label: '(GMT+00:00) London', value: 'GMT' },
    { label: '(GMT+01:00) Berlin', value: 'CET' }
  ];

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-15% 0px -45% 0px', // Standard scroll-spy range
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => this.observer?.observe(section));
  }

  get currentSections() {
    return this.userRole === 'freelancer' ? this.freelancerSections : this.clientSections;
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }



  // PROFESSIONAL DETAILS DATA
  selectedCategories: string[] = [];
  skills: string[] = [];
  currentSkill: string = '';

  categoryOptions = [
    { label: 'Web Development', value: 'Web Development' },
    { label: 'Mobile Development', value: 'Mobile Development' },
    { label: 'UI/UX Design', value: 'UI/UX Design' },
    { label: 'Data Science', value: 'Data Science' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Content Writing', value: 'Content Writing' }
  ];

  addCategory(value: any): void {
    if (value && !this.selectedCategories.includes(value)) {
      this.selectedCategories.push(value);
    }
  }

  removeCategory(index: number): void {
    this.selectedCategories.splice(index, 1);
    this.selectedCategories = [...this.selectedCategories]; // Trigger change detection
  }

  removeCategoryByValue(value: string): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== value);
  }

  getCategoryLabel(value: string): string {
    const opt = this.categoryOptions.find(o => o.value === value);
    return opt ? opt.label : value;
  }

  addSkill(value: string): void {
    const trimmed = value.trim();
    if (trimmed && !this.skills.includes(trimmed)) {
      this.skills.push(trimmed);
      this.currentSkill = '';
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  setSelection(type: string, value: string): void {
    if (type === 'experience') this.experienceLevel = value;
    if (type === 'availability') this.availabilityType = value;
    if (type === 'clientType') this.clientType = value;
    if (type === 'hiringType') this.hiringType = value;
    if (type === 'gender') this.gender = value;
  }

  triggerFileUpload(): void {
    const fileInput = document.getElementById('profilePicInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // Logic to handle file (e.g. upload or preview)
    }
  }

  addSocialLink(): void {
    // This just resets the current link input or opens the form
    this.currentLink = { platform: '', url: '' };
  }

  saveSocialLink(): void {
    if (this.currentLink.platform && this.currentLink.url) {
      this.savedSocialLinks.push({ ...this.currentLink, status: 'Connected' });
      this.currentLink = { platform: '', url: '' };
    }
  }

  removeSocialLink(index: number): void {
    this.savedSocialLinks.splice(index, 1);
  }

  openEditModal(index: number): void {
    this.editingLinkIndex = index;
    this.editingLinkData = { ...this.savedSocialLinks[index] };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingLinkIndex = -1;
  }

  updateSocialLink(): void {
    if (this.editingLinkIndex > -1) {
      this.savedSocialLinks[this.editingLinkIndex].url = this.editingLinkData.url;
      this.closeEditModal();
    }
  }

  getPlatformIcon(platform: string): string {
    const option = this.platformOptions.find(o => o.value === platform);
    return option ? option.icon : 'bi-link-45deg';
  }

  toggleRole(): void {
    this.userRole = this.userRole === 'freelancer' ? 'client' : 'freelancer';
    this.activeSection = 'basic';
    this.progress = 0;

    // Re-setup observer after role change to catch new sections
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 100);
  }

  onSaveAndContinue(): void {
    console.log('Saving profile data...', {
      role: this.userRole,
      experience: this.experienceLevel,
      availability: this.availabilityType,
      clientType: this.clientType,
      hiring: this.hiringType,
      gender: this.gender
    });
  }
}
