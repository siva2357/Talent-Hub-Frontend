import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SidebarLayout } from '../../layouts/sidebar-layout/sidebar-layout';
import { NavbarLayout } from "../../layouts/navbar-layout/navbar-layout";
import { MobileLayout } from "../../layouts/mobile-layout/mobile-layout";
import { SidebarItem } from '../../layouts/sidebar-menu.model';

@Component({
  selector: 'app-user-pages',
 imports: [NavbarLayout, SidebarLayout, MobileLayout, RouterModule],
  templateUrl: './user-pages.html',
  styleUrl: './user-pages.css',
})
export class UserPages {

    userMenu: SidebarItem[] = [

  { label: 'Dashboard', icon: 'bi-grid', link: 'dashboard' },
  { label: 'Analytics', icon: 'bi-graph-up-arrow', link: 'analytics' },
  { label: 'Recruiters', icon: 'bi-person-badge', link: 'recruiters-list' },
  { label: 'Seekers', icon: 'bi-people', link: 'seekers-list' },
  { label: 'Companies', icon: 'bi-briefcase', link: 'company-list' },
  { label: 'Blog', icon: 'bi-book', link: 'blog-list' },



  { label: 'My Dashboard', icon: 'bi-grid', link: 'my-dashboard' },
  { label: 'My Jobposts', icon: 'bi-briefcase', link: 'my-jobposts' },
  { label: 'Manage Interviews', icon: 'bi-camera-video', link: 'manage-interviews' },
  { label: 'Talents', icon: 'bi-people', link: 'talents' },
  { label: 'Saved Talents', icon: 'bi-person-check', link: 'saved-talents' },
  { label:'Hired Talents', icon:"bi-person-check-fill", link:'hired-talents'},


  { label: 'Job Profiles', icon: 'bi-briefcase', link: 'jobprofile' },
  { label: 'Saved Jobposts', icon: 'bi-bookmark-heart', link: 'saved-jobposts' },
  { label: 'Applied Jobposts', icon: 'bi-send', link: 'applied-jobposts' },
  { label: 'Assessments', icon: 'bi-clipboard-check', link: 'assessments' },
  { label: 'Interviews', icon: 'bi-camera-video', link: 'scheduled-meetings' },
  { label: 'My Portfolio', icon: 'bi-person-workspace', link: 'my-portfolio' },
  { label: 'Resume Scoring', icon: 'bi-file-earmark-bar-graph', link: 'resume-analytics' },


  ];


}
