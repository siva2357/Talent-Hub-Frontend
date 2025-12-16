

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview-session-page',
  imports: [RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './interview-session-page.html',
  styleUrl: './interview-session-page.css',
  standalone:true
})
export class InterviewSessionPage {

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  fullName = '';
  micOn = true;
  cameraOn = true;
  stream!: MediaStream;
  interviewId!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.interviewId = this.route.snapshot.paramMap.get('id')!;

  }

  async ngAfterViewInit() {
    await this.initMedia();
  }

  async initMedia() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    this.videoRef.nativeElement.srcObject = this.stream;
  }

  toggleMic() {
    this.micOn = !this.micOn;
    this.stream.getAudioTracks().forEach(t => t.enabled = this.micOn);
  }

  toggleCamera() {
    this.cameraOn = !this.cameraOn;
    this.stream.getVideoTracks().forEach(t => t.enabled = this.cameraOn);
  }

joinMeeting() {
  this.router.navigate(
    ['/seeker/interview/meet-session', this.interviewId],
    {
      state: {
        fullName: this.fullName,
        micOn: this.micOn,
        cameraOn: this.cameraOn
      }
    }
  );
}

}
