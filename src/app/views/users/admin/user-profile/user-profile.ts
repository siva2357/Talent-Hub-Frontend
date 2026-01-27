import { Component } from '@angular/core';
import { AdminService } from '../../../../core/services/admin-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  standalone:true
})
export class UserProfile {
public adminProfile!: any;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

    ngOnInit(): void {
     this.loadAdminProfile()
  }

    loadAdminProfile(): void {
    this.adminService.getAdminById().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.adminProfile = response.data.profile;
          console.log('Profile:', this.adminProfile);
        }
      },
      error: (err) => {
        console.error('❌ Failed to load job seeker profile', err);
      }
    });
  }
goBack(){
  this.router.navigate(['/admin']);
}


}
