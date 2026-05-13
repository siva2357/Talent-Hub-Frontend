import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top py-3 glass-navbar">
      <div class="container-xxl px-3 px-xl-5">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <img src="assets/logo/website-logo.png" alt="Talent Hub" height="45" class="me-2 logo-glow">
        </a>
        
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto gap-0 gap-xl-3 py-3 py-lg-0">
            <li class="nav-item"><a class="nav-link text-white fw-medium px-2 px-xl-3" routerLink="/hire-talent" routerLinkActive="active">Hire Talent</a></li>
            <li class="nav-item"><a class="nav-link text-white fw-medium px-2 px-xl-3" routerLink="/find-work" routerLinkActive="active">Find Work</a></li>
            <li class="nav-item"><a class="nav-link text-white fw-medium px-2 px-xl-3" routerLink="/why-talenthub" routerLinkActive="active">Why Talent Hub</a></li>
            <li class="nav-item"><a class="nav-link text-white fw-medium px-2 px-xl-3" routerLink="/services" routerLinkActive="active">Services</a></li>
            <li class="nav-item"><a class="nav-link text-white fw-medium px-2 px-xl-3" routerLink="/about-us" routerLinkActive="active">About Us</a></li>
            <li class="nav-item"><a class="nav-link text-white fw-medium px-2 px-xl-3" routerLink="/blog" routerLinkActive="active">Blog</a></li>
          </ul>
          <div class="d-flex flex-column flex-lg-row align-items-center gap-2 gap-xl-3 mt-3 mt-lg-0 pb-3 pb-lg-0">
            <a href="/account/signup" target="_blank" class="text-decoration-none w-100 w-lg-auto">
              <app-button variant="white" customClass="w-100 px-lg-3 px-xl-4">Sign Up</app-button>
            </a>
            <a href="/account/signin" target="_blank" class="text-decoration-none w-100 w-lg-auto">
              <app-button variant="outline" customClass="w-100 px-lg-3 px-xl-4">Sign In</app-button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .glass-navbar {
      background: rgba(0, 0, 0, 0.75) !important;
      backdrop-filter: blur(15px) saturate(180%);
      -webkit-backdrop-filter: blur(15px) saturate(180%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      transition: all 0.3s ease;
    }
    
    .logo-glow {
      filter: drop-shadow(0 0 8px rgba(42, 128, 255, 0.3));
    }

    .navbar-nav .nav-link {
      transition: all 0.2s ease;
      font-size: 14px;
      white-space: nowrap;
    }

    .navbar-nav .nav-link:hover {
      color: var(--brand-300) !important;
      transform: translateY(-1px);
    }

    .nav-link.active {
      color: var(--brand-400) !important;
      font-weight: 600 !important;
    }

    @media (max-width: 991.98px) {
      .navbar-collapse {
        background: rgba(0, 0, 0, 0.95);
        margin: 0 -1rem;
        padding: 1rem 1.5rem;
        border-radius: 0 0 1.5rem 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-top: none;
      }
    }

    @media (min-width: 1200px) {
      .navbar-nav .nav-link {
        font-size: 16px;
      }
    }

    @media (min-width: 992px) and (max-width: 1199.98px) {
      .navbar-nav .nav-link {
        font-size: 13px;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
      }
      .navbar-brand img {
        height: 35px !important;
      }
    }
  `]
})
export class NavbarComponent { }
