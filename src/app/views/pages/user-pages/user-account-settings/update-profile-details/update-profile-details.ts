import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth-service';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';


@Component({
  selector: 'app-update-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './update-profile-details.html',
  styleUrl: './update-profile-details.css'
})
export class UpdateProfileDetails implements OnInit {

  role: string | null = null;
  imageUrl: string = '';
  selectedFile!: File;
  isLoading = false;
  isUploading = false;

  constructor(
    private authService: AuthService,
    private seekerService: SeekerProfileService,
    private recruiterService: RecruiterProfileService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadProfileImage();
  }

  loadProfileImage(): void {
    this.isLoading = true;

    if (this.role === 'jobSeeker') {
      this.seekerService.getJobSeekerProfilePicture().subscribe({
        next: (res) => {
          this.imageUrl = res.data?.profilePhoto;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    } else if (this.role === 'recruiter') {
      this.recruiterService.getRecruiterProfilePicture().subscribe({
        next: (res) => {
          this.imageUrl = res.data?.profilePhoto;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.isUploading = true;

    if (this.role === 'jobSeeker') {
      this.seekerService.updateJobSeekerProfilePicture(formData as any).subscribe({
        next: () => {
          this.isUploading = false;
          this.loadProfileImage();
        },
        error: () => (this.isUploading = false),
      });
    } else if (this.role === 'recruiter') {
      this.recruiterService.updateRecruiterProfilePicture(formData as any).subscribe({
        next: () => {
          this.isUploading = false;
          this.loadProfileImage();
        },
        error: () => (this.isUploading = false),
      });
    }
  }
}
