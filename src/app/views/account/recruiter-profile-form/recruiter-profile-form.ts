import { Component} from '@angular/core';
import { RouterLink } from "@angular/router";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-recruiter-profile-form',
  standalone: true,
  imports: [RouterLink,RouterModule ],
  templateUrl: './recruiter-profile-form.html',
  styleUrl: './recruiter-profile-form.css',
})
export class RecruiterProfileForm {



}
