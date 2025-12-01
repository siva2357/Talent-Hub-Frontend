import { Component, HostListener, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header-layout',
  imports: [CommonModule,RouterModule],
  templateUrl: './header-layout.html',
  styleUrl: './header-layout.css',
  standalone: true,
})
export class HeaderLayout implements OnInit {

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.updateView();
  }


  @HostListener('window:resize')
  onResize() {
    this.updateView();
  }


  private updateView() {
    this.isMobile = window.innerWidth < 992;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMobile: boolean = false;
showTalentMenu = false;
showWorkMenu = false;
showWhyMenu = false;

hideTimeout: any = null;

onMenuEnter(menu: 'talent' | 'work' | 'why') {
  clearTimeout(this.hideTimeout);
  this.resetMenus(); // hide all first

  if (menu === 'talent') this.showTalentMenu = true;
  else if (menu === 'work') this.showWorkMenu = true;
  else if (menu === 'why') this.showWhyMenu = true;
}

onMenuLeave() {
  this.hideTimeout = setTimeout(() => {
    this.resetMenus();
  }, 200);
}

resetMenus() {
  this.showTalentMenu = false;
  this.showWorkMenu = false;
  this.showWhyMenu = false;
}


goToSignupPage(){
    this.router.navigate(['sign-up']);
}

goToLoginPage(){
     this.router.navigate(['login']);
}

}
