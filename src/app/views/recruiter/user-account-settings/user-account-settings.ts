import { Component } from '@angular/core';
import { UpdateBasicDetails } from "./update-basic-details/update-basic-details";
import { UpdateProfileDetails } from "./update-profile-details/update-profile-details";
import { UpdateProfessionalDetails } from "./update-professional-details/update-professional-details";
import { UpdateChangePassword } from "./update-change-password/update-change-password";
import { ManageAccount } from "./manage-account/manage-account";

@Component({
  selector: 'app-user-account-settings',
  imports: [UpdateBasicDetails, UpdateProfileDetails, UpdateProfessionalDetails, UpdateChangePassword, ManageAccount],
  templateUrl: './user-account-settings.html',
  styleUrl: './user-account-settings.css',
    standalone: true,
})
export class UserAccountSettings {

}
