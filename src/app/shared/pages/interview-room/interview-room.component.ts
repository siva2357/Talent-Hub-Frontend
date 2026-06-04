import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}

@Component({
  selector: 'app-interview-room',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './interview-room.component.html',
  styleUrl: './interview-room.component.css',
})
export class InterviewRoomComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('chatScrollContainer') chatScrollContainer!: ElementRef<HTMLDivElement>;

  applicationId: string | null = null;
  applicationData: any = null;
  currentUser: any = null;
  userRole: string = '';
  
  // Participant Info
  localParticipantName: string = '';
  remoteParticipantName: string = 'Attendee';
  remoteParticipantRole: string = 'Attendee';

  // State flags
  micEnabled: boolean = true;
  cameraEnabled: boolean = true;
  chatOpen: boolean = false;
  isLoading: boolean = true;

  // Media
  localStream: MediaStream | null = null;
  hasMediaError: boolean = false;

  // Timer
  meetingTimeElapsed: number = 0;
  timerIntervalId: any = null;

  // Chat
  newMessageText: string = '';
  chatMessages: ChatMessage[] = [];
  private responsePoolIndex: number = 0;

  // Inter-tab / Connection Exits States
  remoteParticipantLeft: boolean = false;
  hostExited: boolean = false;
  private pollIntervalId: any = null;
  private checkIntervalId: any = null;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.userRole = this.currentUser?.role?.toLowerCase() || '';
    this.localParticipantName = this.currentUser?.fullName || 'You';

    // Query params configuration
    this.applicationId = this.route.snapshot.queryParamMap.get('id');
    const micParam = this.route.snapshot.queryParamMap.get('mic');
    const camParam = this.route.snapshot.queryParamMap.get('cam');

    this.micEnabled = micParam !== 'false';
    this.cameraEnabled = camParam !== 'false';

    if (this.applicationId) {
      localStorage.removeItem(`th_meeting_freelancer_left_${this.applicationId}`);
      this.loadApplicationDetails();
      this.startConnectionCheckers();
    } else {
      this.isLoading = false;
    }

    this.startCamera();
    this.startTimer();
    this.initializeChat();
  }

  loadApplicationDetails(): void {
    this.isLoading = true;
    this.applicationService.getApplicationById(this.applicationId!).subscribe({
      next: (res) => {
        if (res.success && res.application) {
          this.applicationData = res.application;
          this.determineParticipantNames();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load application details in meeting room:', err);
        this.isLoading = false;
      }
    });
  }

  determineParticipantNames(): void {
    if (!this.applicationData) return;

    if (this.userRole === 'client') {
      this.remoteParticipantName = this.applicationData.freelancerId?.registrationDetails?.fullName || 'Freelancer';
      this.remoteParticipantRole = 'Freelancer';
    } else {
      this.remoteParticipantName = this.applicationData.clientId?.registrationDetails?.fullName || 'Client';
      this.remoteParticipantRole = 'Client';
    }
  }

  startConnectionCheckers(): void {
    if (!this.applicationId || this.applicationId === 'demo') return;

    // 1. Client monitors if Freelancer has left via LocalStorage (cross-tab sync)
    if (this.userRole === 'client') {
      this.checkIntervalId = setInterval(() => {
        const freelancerLeft = localStorage.getItem(`th_meeting_freelancer_left_${this.applicationId}`);
        if (freelancerLeft === 'true') {
          this.remoteParticipantLeft = true;
          clearInterval(this.checkIntervalId);
        }
      }, 2000);
    }

    // 2. Freelancer polls database status to detect if Client ended the meeting
    if (this.userRole === 'freelancer') {
      this.pollIntervalId = setInterval(() => {
        this.applicationService.getApplicationById(this.applicationId!).subscribe({
          next: (res) => {
            if (res.success && res.application) {
              const status = res.application.applicationStatus;
              const interviewStatus = res.application.interview?.status;
              
              if (status === 'interview completed' || interviewStatus === 'completed') {
                this.hostExited = true;
                this.stopCamera();
                clearInterval(this.pollIntervalId);
                setTimeout(() => {
                  this.router.navigate(['/user/proposals']);
                }, 3500);
              }
            }
          },
          error: (err) => {
            console.error('Connection poll error:', err);
          }
        });
      }, 3000);
    }
  }

  startCamera(): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.localStream = stream;
        this.localStream.getVideoTracks().forEach(track => track.enabled = this.cameraEnabled);
        this.localStream.getAudioTracks().forEach(track => track.enabled = this.micEnabled);

        setTimeout(() => {
          if (this.localVideo && this.localVideo.nativeElement) {
            this.localVideo.nativeElement.srcObject = stream;
          }
          if (this.remoteVideo && this.remoteVideo.nativeElement) {
            this.remoteVideo.nativeElement.srcObject = stream;
          }
        }, 100);
      })
      .catch(err => {
        console.error('Failed to bind media devices in meeting room:', err);
        this.hasMediaError = true;
      });
  }

  stopCamera(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  startTimer(): void {
    this.timerIntervalId = setInterval(() => {
      this.meetingTimeElapsed++;
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.meetingTimeElapsed / 60);
    const seconds = this.meetingTimeElapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleMic(): void {
    this.micEnabled = !this.micEnabled;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => track.enabled = this.micEnabled);
    }
  }

  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => track.enabled = this.cameraEnabled);
    }
  }

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  initializeChat(): void {
    // Initial welcome message
    setTimeout(() => {
      this.chatMessages.push({
        sender: this.remoteParticipantName,
        text: `Hello! Thanks for joining. Let me know when you are ready to begin the interview discussion.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false
      });
      this.scrollToBottom();
    }, 1500);
  }

  sendMessage(): void {
    if (!this.newMessageText.trim()) return;

    const userMessage: ChatMessage = {
      sender: this.localParticipantName,
      text: this.newMessageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    this.chatMessages.push(userMessage);
    this.newMessageText = '';
    this.scrollToBottom();

    // Trigger mock response
    this.simulateRemoteResponse();
  }

  simulateRemoteResponse(): void {
    const responses = [
      "That sounds great. Can you briefly walk me through your relevant skills for this project?",
      "Yes, absolutely. What is your preferred stack or workflow when addressing these tasks?",
      "Excellent points. How do you usually handle milestones, timelines, and reporting progress?",
      "Got it. I think this aligns very well with our project requirements. Let's wrap up this call and finalize our next steps.",
      "Perfect. Thank you for your time today! I will update the interview results on the portal right now."
    ];

    setTimeout(() => {
      const text = responses[this.responsePoolIndex % responses.length];
      this.responsePoolIndex++;

      this.chatMessages.push({
        sender: this.remoteParticipantName,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false
      });
      this.scrollToBottom();
    }, 1800);
  }

  scrollToBottom(): void {
    try {
      if (this.chatScrollContainer && this.chatScrollContainer.nativeElement) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Ignore scroll error
    }
  }

  endMeeting(): void {
    if (confirm('Are you sure you want to end this meeting?')) {
      if (this.userRole === 'client' && this.applicationId && this.applicationId !== 'demo') {
        // Call backend API to mark the interview as completed
        this.applicationService.interviewResult(this.applicationId, { result: 'completed' }).subscribe({
          next: () => {
            alert('Meeting ended. Application status updated to Interview Completed.');
            this.router.navigate(['/user/contract-proposals']);
          },
          error: (err) => {
            console.error('Failed to update interview result:', err);
            // Fallback redirect anyway
            this.router.navigate(['/user/contract-proposals']);
          }
        });
      } else {
        // Freelancer redirect
        if (this.applicationId) {
          localStorage.setItem(`th_meeting_freelancer_left_${this.applicationId}`, 'true');
        }
        this.router.navigate(['/user/proposals']);
      }
    }
  }

  ngOnDestroy(): void {
    // Stop tracks
    this.stopCamera();

    // Clear timer
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
    // Clear poll/check intervals
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
    }
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }
  }
}
