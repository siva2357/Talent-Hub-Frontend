import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SidebarItem, SidebarLayout } from '../layouts/sidebar-layout/sidebar-layout';
import { NavbarLayout } from "../layouts/navbar-layout/navbar-layout";
import { MobileLayout } from "../layouts/mobile-layout/mobile-layout";


@Component({
  selector: 'app-seeker',
  imports: [RouterModule, SidebarLayout, NavbarLayout, MobileLayout],
  templateUrl: './seeker.html',
  styleUrl: './seeker.css',
  standalone: true,
})
export class Seeker {

  jobSeekerMenu: SidebarItem[] = [
  { label: 'Job Profiles', icon: 'bi-briefcase', link: 'jobposts' },
  { label: 'Applied Jobposts', icon: 'bi-send', link: 'applied-jobposts' },
  { label: 'Assessments', icon: 'bi-clipboard-check', link: 'assessments' },
  { label: 'Interviews', icon: 'bi-camera-video', link: 'scheduled-meetings' },
  { label: 'My Portfolio', icon: 'bi-person-workspace', link: 'my-portfolio' },
  { label: 'Resume Scoring', icon: 'bi-file-earmark-bar-graph', link: 'resume-analytics' }
];


}
