import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WebrtcService } from '../../../core/services/webrtc-service';
import { SignalingService } from '../../../core/services/signaling-service';
import { AuthService } from '../../../core/services/auth-service';

import { FilePreview } from '../file-preview/file-preview';
import { FileUpload } from '../file-upload/file-upload';
import { BucketKey } from '../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../core/enums/upload-section.constant';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-interview-meeting-page',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    FilePreview,
    FileUpload
  ],
  templateUrl: './interview-meeting-page.html',
  styleUrl: './interview-meeting-page.css'
})
export class InterviewMeetingPage
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('selfVideo') selfVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('mainVideo') mainVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoUploader') videoUploader!: FileUpload;

  meetingId!: string;
  role!: 'recruiter' | 'jobSeeker';

  participantName = '';
  remoteUserLabel = '';

  micOn = true;
  camOn = true;

  isRecording = false;
  meetingEnded = false;
  showReportForm = false;

  interviewVideoUrl = '';
  rating = 0;
  remarks = '';

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  private mediaRecorder?: MediaRecorder;
  private recordedChunks: Blob[] = [];
private pendingIceCandidates: RTCIceCandidateInit[] = [];
private remoteDescriptionSet = false;

  constructor(
    private rtc: WebrtcService,
    private signaling: SignalingService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
      private cdr: ChangeDetectorRef   // 🔥 ADD
  ) {}

  /* 🔥 FIX NG0100 HERE */
  ngOnInit(): void {
    const role = this.auth.getRole();
    if (role !== 'recruiter' && role !== 'jobSeeker') {
      this.router.navigate(['/']);
      return;
    }

    this.role = role;
    this.participantName = this.auth.getUserName() || '';
    this.remoteUserLabel =
      role === 'recruiter' ? 'Interviewee' : 'Interviewer';

    const meetingId = this.route.snapshot.paramMap.get('meetingId');
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (!meetingId || !sessionId) {
      this.router.navigate(['/']);
      return;
    }
    this.meetingId = meetingId;
  }

  async ngAfterViewInit(): Promise<void> {
    await this.rtc.initLocalMedia(this.selfVideo.nativeElement);

    if (this.role === 'jobSeeker') {
      this.startRecording();
    }

    this.initSocket();
  }

  ngOnDestroy(): void {
    this.rtc.close();
  }

  private startRecording(): void {
    const stream = this.rtc.getLocalStream();
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });

    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size) this.recordedChunks.push(e.data);
    };

    this.mediaRecorder.start();
    this.isRecording = true;
  }

private stopRecordingAndUpload(): void {
  if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;

  this.mediaRecorder.stop();
  this.isRecording = false;

  this.mediaRecorder.onstop = () => {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const file = new File([blob], `${this.meetingId}.webm`, {
      type: 'video/webm'
    });

    // ✅ ACTUAL UPLOAD
    this.videoUploader.uploadFile(file);
  };
}


  private initSocket(): void {
    this.signaling.connect();
    const socket = this.signaling.getSocket();

    this.signaling.joinMeeting(this.meetingId, this.role);

    const peer = this.rtc.createPeer(this.mainVideo.nativeElement);

    peer.onicecandidate = e => {
      if (e.candidate) {
this.signaling.sendIce(this.meetingId, {
  candidate: e.candidate.candidate,
  sdpMid: e.candidate.sdpMid,
  sdpMLineIndex: e.candidate.sdpMLineIndex
});
      }
    };

socket.on('offer', async data => {
  if (this.role !== 'jobSeeker') return;
  if (!data?.offer?.sdp) return;

  await peer.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );

  this.remoteDescriptionSet = true;

  // 🔥 Apply queued ICE
  for (const candidate of this.pendingIceCandidates) {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }
  this.pendingIceCandidates = [];

  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  this.signaling.sendAnswer(this.meetingId, answer);
});


socket.on('answer', async data => {
  if (this.role !== 'recruiter') return;
  if (!data?.answer?.sdp) return;

  await peer.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );

  this.remoteDescriptionSet = true;

  // 🔥 Apply queued ICE
  for (const candidate of this.pendingIceCandidates) {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }
  this.pendingIceCandidates = [];
});


socket.on('ice-candidate', async data => {
  const c = data?.candidate;

  if (!c) return;
  if (!c.candidate) return; // 🔑 IMPORTANT

  if (this.remoteDescriptionSet) {
    try {
      await peer.addIceCandidate(c);
    } catch (e) {
      console.warn('ICE add failed', e);
    }
  } else {
    this.pendingIceCandidates.push(c);
  }
});

socket.on('interview-video-url', (data) => {
  if (this.role !== 'recruiter') return;

  const url = typeof data === 'string' ? data : data?.url;
  if (!url) return;

  this.interviewVideoUrl = url;

  // ✅ ADD THIS LINE
  console.log('📹 recruiter got video:', this.interviewVideoUrl);

  // 🔥 Force UI update
  this.cdr.detectChanges();
});



if (this.role === 'recruiter') {
  socket.on('user-joined', async () => {
    const offer = await peer.createOffer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true
    });

    await peer.setLocalDescription(offer);
    this.signaling.sendOffer(this.meetingId, offer);
  });
}


socket.on('call-ended', () => {
  this.meetingEnded = true;
});

  }

  /* UI */

  toggleMic() {
    this.micOn = !this.micOn;
    this.rtc.toggleMic(this.micOn);
  }

  toggleCamera() {
    this.camOn = !this.camOn;
    this.rtc.toggleCamera(this.camOn);
  }

leaveMeeting(): void {
  if (this.role !== 'jobSeeker' || this.meetingEnded) return;

  this.meetingEnded = true;

  // ✅ THIS IS THE KEY FIX
  this.stopRecordingAndUpload();
}



endCall() {
  // Recruiter only opens report form
  this.showReportForm = true;
}


onPhotoUploaded(url: string): void {
  const finalUrl = `${url}?v=${Date.now()}`;
  this.interviewVideoUrl = finalUrl;

  console.log('📤 video uploaded:', finalUrl);

  // ✅ send to recruiter
  this.signaling.sendInterviewVideoUrl(this.meetingId, finalUrl);

  // ✅ notify recruiter call ended
  this.signaling.endCall(this.meetingId);

  // ✅ redirect jobseeker ONLY AFTER upload
  setTimeout(() => {
    this.rtc.close();
    this.router.navigate(['/jobSeeker/scheduled-meetings']);
  }, 300);
}



submitInterviewReport(): void {
  if (!this.interviewVideoUrl || this.rating < 1 || this.rating > 10) return;

  this.signaling.endCall(this.meetingId);
  this.rtc.close();

  setTimeout(() => {
    this.router.navigate(['/recruiter/scheduled-meetings']);
  }, 300);
}




  goBack() {
    this.router.navigate([`${this.role}/scheduled-meetings`]);
  }
}
