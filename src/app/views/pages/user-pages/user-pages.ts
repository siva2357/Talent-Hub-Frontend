import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SidebarLayout } from '../../layouts/sidebar-layout/sidebar-layout';
import { NavbarLayout } from "../../layouts/navbar-layout/navbar-layout";
import { MobileLayout } from "../../layouts/mobile-layout/mobile-layout";
import { SidebarItem } from '../../layouts/sidebar-menu.model';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-user-pages',
 imports: [NavbarLayout, SidebarLayout, MobileLayout, RouterModule],
  templateUrl: './user-pages.html',
  styleUrl: './user-pages.css',
})
export class UserPages {
  filteredMenu: SidebarItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const role = this.authService.getRole();

    this.filteredMenu = this.userMenu.filter(
      item => !item.role || item.role === role
    );
  }



userMenu: SidebarItem[] = [

  // ADMIN
  { label: 'Dashboard', icon: 'bi-grid', link: 'dashboard', role: 'admin' },
  { label: 'Recruiters', icon: 'bi-person-badge', link: 'recruiters-list', role: 'admin' },
  { label: 'Seekers', icon: 'bi-people', link: 'seekers-list', role: 'admin' },
  { label: 'Companies', icon: 'bi-briefcase', link: 'company-list', role: 'admin' },
  { label: 'Blog', icon: 'bi-book', link: 'blog-list', role: 'admin' },

  // RECRUITER
  { label: 'My Dashboard', icon: 'bi-grid', link: 'my-dashboard', role: 'recruiter' },
  { label: 'My Jobposts', icon: 'bi-briefcase', link: 'my-jobposts', role: 'recruiter' },
  { label: 'Manage Interviews', icon: 'bi-camera-video', link: 'manage-interviews', role: 'recruiter' },
  { label: 'Talents', icon: 'bi-people', link: 'talents', role: 'recruiter' },
  { label: 'Saved Talents', icon: 'bi-person-check', link: 'saved-talents', role: 'recruiter' },
  { label:'Hired Talents', icon:"bi-person-check-fill", link:'hired-talents', role: 'recruiter' },

  // JOB SEEKER
  { label: 'Job Profiles', icon: 'bi-briefcase', link: 'jobprofile', role: 'jobSeeker' },
  { label: 'Saved Jobposts', icon: 'bi-bookmark-heart', link: 'saved-jobposts', role: 'jobSeeker' },
  { label: 'Applied Jobposts', icon: 'bi-send', link: 'applied-jobposts', role: 'jobSeeker' },
  { label: 'Assessments', icon: 'bi-clipboard-check', link: 'assessments', role: 'jobSeeker' },
  { label: 'Interviews', icon: 'bi-camera-video', link: 'scheduled-meetings', role: 'jobSeeker' },
  { label: 'My Portfolio', icon: 'bi-person-workspace', link: 'my-portfolio', role: 'jobSeeker' },
  { label: 'Resume Scoring', icon: 'bi-file-earmark-bar-graph', link: 'resume-analytics', role: 'jobSeeker' },

];


}
