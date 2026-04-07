import { Component } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { UpdateBasicDetails } from './update-basic-details/update-basic-details';
import { UpdateProfileDetails } from './update-profile-details/update-profile-details';
import { UpdateChangePassword } from './update-change-password/update-change-password';
import { UpdateProfessionalDetails } from './update-professional-details/update-professional-details';
import { ManageAccount } from './manage-account/manage-account';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';


@Component({
  selector: 'app-user-account-settings',
  imports: [UpdateBasicDetails,UpdateProfileDetails, UpdateChangePassword,UpdateProfessionalDetails,ManageAccount,RouterModule,FormsModule,CommonModule],
  templateUrl: './user-account-settings.html',
  styleUrl: './user-account-settings.css',
    standalone: true,
})
export class UserAccountSettings {

    constructor(
    private router: Router,
    private authService: AuthService
  ) {}


   activeTab: string = 'basic';

  setTab(tab: string) {
    this.activeTab = tab;
  }

    goBack(): void {
    const role = this.authService.getRole();

    if (role === 'recruiter') {
      this.router.navigate(['/user/my-jobposts']);
    } else if (role === 'jobSeeker') {
      this.router.navigate(['/user/jobprofile']);
    } else {
      this.router.navigate(['/']); // fallback
    }
  }

}
