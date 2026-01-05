import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SignalingService {

  private socket!: Socket;

  connect(): Socket {
    if (!this.socket || !this.socket.connected) {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket'],
      });
    }
    return this.socket;
  }

  getSocket(): Socket {
    return this.socket;
  }

  joinMeeting(meetingId: string, role: 'recruiter' | 'jobSeeker') {
    this.socket.emit('join-meeting', { meetingId, role });
  }

  sendOffer(meetingId: string, offer: RTCSessionDescriptionInit) {
    this.socket.emit('offer', { meetingId, offer });
  }

  sendAnswer(meetingId: string, answer: RTCSessionDescriptionInit) {
    this.socket.emit('answer', { meetingId, answer });
  }

  sendIce(meetingId: string, candidate: RTCIceCandidateInit) {
    this.socket.emit('ice-candidate', { meetingId, candidate });
  }

  endCall(meetingId: string) {
    this.socket.emit('end-call', { meetingId });
  }

  sendInterviewVideoUrl(meetingId: string, url: string) {
    this.socket.emit('interview-video-url', { meetingId, url });
  }

  ackInterviewVideo(meetingId: string) {
    this.socket.emit('interview-video-ack', { meetingId });
  }
}
