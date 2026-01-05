import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebrtcService {

  private peer!: RTCPeerConnection;
  private localStream!: MediaStream;
  private remoteStream!: MediaStream;

  private iceConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  async initLocalMedia(videoEl: HTMLVideoElement): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    videoEl.srcObject = this.localStream;
    videoEl.muted = true;
    await videoEl.play();
  }

 createPeer(remoteVideoEl: HTMLVideoElement): RTCPeerConnection {
  this.peer = new RTCPeerConnection(this.iceConfig);

  this.remoteStream = new MediaStream();
  remoteVideoEl.srcObject = this.remoteStream;

  remoteVideoEl.autoplay = true;
  remoteVideoEl.playsInline = true;
  remoteVideoEl.muted = true; // 🔥 REQUIRED

  this.localStream.getTracks().forEach(track =>
    this.peer.addTrack(track, this.localStream)
  );

this.peer.ontrack = event => {
  console.log('🎥 REMOTE TRACKS:', event.streams[0].getTracks());

  event.streams[0].getTracks().forEach(track =>
    this.remoteStream.addTrack(track)
  );

  setTimeout(() => remoteVideoEl.play().catch(() => {}), 0);
};


  return this.peer;
}


  toggleMic(enabled: boolean) {
    this.localStream.getAudioTracks().forEach(t => t.enabled = enabled);
  }

  toggleCamera(enabled: boolean) {
    this.localStream.getVideoTracks().forEach(t => t.enabled = enabled);
  }

  getLocalStream(): MediaStream {
    return this.localStream;
  }

  close() {
    this.peer?.close();
    this.localStream?.getTracks().forEach(t => t.stop());
  }
}
