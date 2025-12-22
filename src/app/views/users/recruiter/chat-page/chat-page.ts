import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  imports: [RouterModule],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css',
  standalone: true,
})
export class ChatPage implements OnInit {

  isMobile = false;
  mobileChatOpen = false;

  ngOnInit() {
    this.checkScreen();
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;

    // Ensure sidebar + chat appear correctly on desktop
    if (!this.isMobile) {
      this.mobileChatOpen = false;
    }
  }

  openChatMobile() {
    if (this.isMobile) {
      this.mobileChatOpen = true;
    }
  }

  backToMessages() {
    this.mobileChatOpen = false;
  }
}
