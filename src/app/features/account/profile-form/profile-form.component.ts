import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, TitleCasePipe],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
})
export class ProfileFormComponent {
  userRole: 'freelancer' | 'client' = 'freelancer';
  activeSection: string = 'basic';
  progress: number = 0;

  // SECTIONS DEFINITIONS
  freelancerSections = [
    { id: 'basic', label: 'Basic Identity', sub: 'Tell us who you are', icon: 'bi-person' },
    { id: 'professional', label: 'Professional Details', sub: 'Your work & expertise', icon: 'bi-briefcase' },
    { id: 'availability', label: 'Availability', sub: 'When you can work', icon: 'bi-clock' },
    { id: 'social', label: 'Social & Links', sub: 'Your portfolio & profiles', icon: 'bi-link-45deg' },
    { id: 'verification', label: 'Verification', sub: 'Verify your contact', icon: 'bi-shield-check' },
    { id: 'preferences', label: 'Preferences', sub: 'Your work preferences', icon: 'bi-grid' },
  ];

  clientSections = [
    { id: 'basic', label: 'Basic Information', sub: 'Tell us about yourself', icon: 'bi-person' },
    { id: 'type', label: 'Client Type', sub: 'Select your client type', icon: 'bi-buildings' },
    { id: 'professional', label: 'Professional Details', sub: 'Optional information', icon: 'bi-briefcase' },
    { id: 'hiring', label: 'Hiring Preferences', sub: 'Your hiring preferences', icon: 'bi-search' },
    { id: 'location', label: 'Location', sub: 'Where are you based?', icon: 'bi-geo-alt' },
    { id: 'verification', label: 'Verification', sub: 'Verify your contact details', icon: 'bi-shield-check' },
    { id: 'social', label: 'Social Links', sub: 'Add your social profiles', icon: 'bi-link-45deg' },
  ];

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

  toggleRole(): void {
    this.userRole = this.userRole === 'freelancer' ? 'client' : 'freelancer';
    this.activeSection = 'basic';
    this.progress = 0;
  }

  onSaveAndContinue(): void {
    // Logic for next section or save
    console.log('Saving...');
  }
}
