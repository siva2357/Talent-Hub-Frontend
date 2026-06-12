import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-interview-setup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './interview-setup.component.html',
  styleUrl: './interview-setup.component.css',
})
export class InterviewSetupComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);

  @ViewChild('previewVideo') previewVideo!: ElementRef<HTMLVideoElement>;

  applicationId: string | null = null;
  applicationData: any = null;
  currentUser: any = null;
  otherParticipantName: string = 'Participant';
  otherParticipantRole: string = 'Attendee';

  // Device status states
  micEnabled: boolean = true;
  cameraEnabled: boolean = true;
  localStream: MediaStream | null = null;
  hasMediaError: boolean = false;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.applicationId = this.route.snapshot.queryParamMap.get('id');

    if (this.applicationId && this.applicationId !== 'demo') {
      this.loadApplicationDetails();
    } else {
      this.isLoading = false;
      this.determineParticipantDetails();
    }

    this.startCamera();
  }

  loadApplicationDetails(): void {
    this.isLoading = true;
    this.applicationService.getApplicationById(this.applicationId!).subscribe({
      next: (res) => {
        if (res.success && res.application) {
          this.applicationData = res.application;
          this.determineParticipantDetails();
        } else {
          this.determineParticipantDetails();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load application details:', err);
        this.determineParticipantDetails();
        this.isLoading = false;
      }
    });
  }

  determineParticipantDetails(): void {
    const userRole = this.currentUser?.role?.toLowerCase();
    if (this.applicationData) {
      if (userRole === 'client') {
        this.otherParticipantName = this.applicationData.freelancerId?.registrationDetails?.fullName || 'Freelancer';
        this.otherParticipantRole = 'Freelancer';
      } else {
        this.otherParticipantName = this.applicationData.clientId?.registrationDetails?.fullName || 'Client';
        this.otherParticipantRole = 'Client';
      }
    } else {
      if (userRole === 'client') {
        this.otherParticipantName = 'Freelancer Candidate';
        this.otherParticipantRole = 'Freelancer';
      } else {
        this.otherParticipantName = 'Hiring Client';
        this.otherParticipantRole = 'Client';
      }
    }
  }

  startCamera(): void {
    this.hasMediaError = false;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.localStream = stream;
        // Apply default toggle states
        this.localStream.getVideoTracks().forEach(track => track.enabled = this.cameraEnabled);
        this.localStream.getAudioTracks().forEach(track => track.enabled = this.micEnabled);

        setTimeout(() => {
          if (this.previewVideo && this.previewVideo.nativeElement) {
            this.previewVideo.nativeElement.srcObject = stream;
          }
        }, 100);
      })
      .catch(err => {
        console.error('Error accessing camera/mic:', err);
        this.hasMediaError = true;
      });
  }

  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => track.enabled = this.cameraEnabled);
    }
  }

  toggleMic(): void {
    this.micEnabled = !this.micEnabled;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => track.enabled = this.micEnabled);
    }
  }

  joinMeeting(): void {
    const userRole = this.currentUser?.role?.toLowerCase();
    const queryParams = `?id=${this.applicationId || 'demo'}&mic=${this.micEnabled}&cam=${this.cameraEnabled}`;
    const url = `/user/interview-room${queryParams}`;
    
    if (userRole === 'client') {
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/user/interview-room'], {
        queryParams: {
          id: this.applicationId || 'demo',
          mic: this.micEnabled,
          cam: this.cameraEnabled
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  stopCamera(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}
