import { Component } from '@angular/core';
import { UpdateBasicDetails } from './update-basic-details/update-basic-details';
import { UpdateChangePassword } from './update-change-password/update-change-password';
import { UpdateProfessionalDetails } from './update-professional-details/update-professional-details';
import { ManageAccount } from './manage-account/manage-account';
import { UpdateProfileDetails } from './update-profile-details/update-profile-details';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-user-account-settings',
  imports: [UpdateBasicDetails,UpdateProfileDetails, UpdateChangePassword,UpdateProfessionalDetails,ManageAccount,RouterModule],
  templateUrl: './user-account-settings.html',
  styleUrl: './user-account-settings.css',
    standalone: true,
})
export class UserAccountSettings {

}
