import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterModule } from "@angular/router";
import { SidebarItem, SidebarLayout } from '../layouts/sidebar-layout/sidebar-layout';
import { NavbarLayout } from "../layouts/navbar-layout/navbar-layout";
import { MobileLayout } from "../layouts/mobile-layout/mobile-layout";

@Component({
  selector: 'app-recruiter',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayout, NavbarLayout, MobileLayout],
  templateUrl: './recruiter.html',
  styleUrl: './recruiter.css'
})
export class Recruiter  {

  recruiterMenu: SidebarItem[] = [
  { label: 'My Jobposts', icon: 'bi-briefcase', link: 'my-jobs' },
  { label: 'Proposals', icon: 'bi-file-earmark-text', link: 'job-applications' },
  { label: 'Interviews', icon: 'bi-camera-video', link: 'scheduled-meetings' },
  { label: 'Talents', icon: 'bi-people', link: 'talents' },
  { label: 'Hired Talents', icon: 'bi-person-check', link: 'hired-talents' }
];


}
