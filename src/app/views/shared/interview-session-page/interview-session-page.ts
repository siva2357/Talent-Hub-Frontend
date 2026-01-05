import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview-session-page',
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './interview-session-page.html',
  styleUrl: './interview-session-page.css',
  standalone: true
})
export class InterviewSessionPage implements AfterViewInit, OnDestroy {

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
meetingId!: string;
sessionId!: string;

  fullName = '';
  micOn = true;
  cameraOn = true;

  stream!: MediaStream;
  interviewId!: string;
  mediaError = '';

constructor(
  private router: Router,
  private route: ActivatedRoute
) {
  const meetingId = this.route.snapshot.paramMap.get('meetingId');
  const sessionId = this.route.snapshot.paramMap.get('sessionId');

  if (!meetingId || !sessionId) {
    this.router.navigate(['/']);
    return;
  }

  this.meetingId = meetingId;
  this.sessionId = sessionId;
}

  async ngAfterViewInit() {
    await this.initMedia();
  }

  async initMedia() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      this.videoRef.nativeElement.srcObject = this.stream;
      await this.videoRef.nativeElement.play();
    } catch (err) {
      console.error(err);
      this.mediaError = 'Camera or microphone permission denied';
    }
  }

  toggleMic() {
    this.micOn = !this.micOn;
    this.stream?.getAudioTracks().forEach(
      track => (track.enabled = this.micOn)
    );
  }

  toggleCamera() {
    this.cameraOn = !this.cameraOn;
    this.stream?.getVideoTracks().forEach(
      track => (track.enabled = this.cameraOn)
    );
  }

joinMeeting() {
  if (!this.fullName || !this.stream) return;

  // stop preview cam before joining actual meeting
  this.cleanupMedia();

  this.router.navigate([
    '/interview/meet-session',
    this.meetingId,
    this.sessionId
  ]);
}


  ngOnDestroy() {
    this.cleanupMedia();
  }

  private cleanupMedia() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }
  }
}
