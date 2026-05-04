import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-header-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-layout.html',
  styleUrl: './header-layout.css'
})
export class HeaderLayout implements OnInit {

  isMobile = false;

  constructor(private router: Router,  @Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.updateView();
  }
}

  @HostListener('window:resize')

updateView() {
  if (isPlatformBrowser(this.platformId)) {
    this.isMobile = window.innerWidth < 992;
  }
}

goToLogin() {
  this.router.navigate(['/login']);
}

goToSignup() {
  this.router.navigate(['/signup']);
}
}
