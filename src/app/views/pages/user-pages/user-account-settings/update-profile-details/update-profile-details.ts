import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth-service';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';
import { FilePreview } from '../../../../shared/file-preview/file-preview';
import { FileUpload } from '../../../../shared/file-upload/file-upload';
import { BucketKey } from '../../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../../core/enums/upload-section.constant';

@Component({
  selector: 'app-update-profile-details',
  standalone: true,
  imports: [CommonModule, FilePreview, FileUpload],
  templateUrl: './update-profile-details.html',
  styleUrl: './update-profile-details.css'
})
export class UpdateProfileDetails implements OnInit {
  role: string | null = null;
  imageUrl: string = '';
  isLoading = false;
  
  bucket = BucketKey;
  uploadSection = UploadSection;

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
    const obs = (this.role === 'jobSeeker' 
      ? this.seekerService.getJobSeekerProfilePicture() 
      : this.recruiterService.getRecruiterProfilePicture()) as Observable<any>;

    obs.subscribe({
      next: (res: any) => {
        this.imageUrl = res.data?.profilePhoto;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  onUploadSuccess(url: string) {
    this.imageUrl = url;
    
    const payload = { profilePhoto: url };
    const obs = (this.role === 'jobSeeker'
      ? this.seekerService.updateJobSeekerProfilePicture(payload as any)
      : this.recruiterService.updateRecruiterProfilePicture(payload as any)) as Observable<any>;
      
    obs.subscribe({
      next: () => {
        console.log('Profile photo updated in database');
      }
    });
  }
}
