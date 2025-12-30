import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilePreview } from "../../../../shared/file-preview/file-preview";
import { FileUpload } from "../../../../shared/file-upload/file-upload";
import { UploadSection } from '../../../../../core/enums/upload-section.constant';
import { BucketKey } from '../../../../../core/enums/bucket-key.constant';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';

@Component({
  selector: 'app-update-profile-details',
  standalone: true,
  imports: [CommonModule, FilePreview, FileUpload],
  templateUrl: './update-profile-details.html',
  styleUrl: './update-profile-details.css'
})
export class UpdateProfileDetails implements OnInit {

  isLoading = false;
  isUpdating = false;

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  profilePhotoUrl = '';
  uploadComplete = false;

  constructor(
    private profileService: SeekerProfileService
  ) {}

  ngOnInit(): void {
    this.loadProfileImage();
  }

  /* ================= LOAD IMAGE ================= */
  loadProfileImage(): void {
    this.isLoading = true;

    this.profileService.getJobSeekerProfilePicture().subscribe({
      next: (res) => {
        if (res.success && res.data?.profilePhoto) {
          this.profilePhotoUrl = res.data.profilePhoto;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /* ================= HANDLE UPLOADED IMAGE ================= */
  onPhotoUploaded(url: string): void {
    if (!url) return;

    this.isUpdating = true;
    this.uploadComplete = false;

    this.profileService.updateJobSeekerProfilePicture(url).subscribe({
      next: () => {
        // cache-bust so updated image shows immediately
        this.profilePhotoUrl = `${url}?v=${Date.now()}`;
        this.uploadComplete = true;
        this.isUpdating = false;
      },
      error: () => {
        this.isUpdating = false;
      }
    });
  }
}
