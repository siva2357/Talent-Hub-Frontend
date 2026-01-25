import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-layout.html',
  styleUrl: './header-layout.css'
})
export class HeaderLayout implements OnInit {

  isMobile = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateView();
  }

  @HostListener('window:resize')
  updateView() {
    this.isMobile = window.innerWidth < 1200; // XL breakpoint
  }

goToLogin() {
  window.open(`${window.location.origin}/login`, '_blank', 'noopener,noreferrer');
}

goToSignup() {
  window.open(`${window.location.origin}/sign-up`, '_blank', 'noopener,noreferrer');
}

}
