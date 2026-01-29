import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai-chabot-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chabot-component.html',
  styleUrl: './ai-chabot-component.css',
  standalone: true,
})
export class AiChabotComponent implements OnInit {

  isOpen = false;
  input = '';
  messages: ChatMessage[] = [];

  // 👋 intro popup
  showIntro = false;

  ngOnInit() {
    const seen = localStorage.getItem('aiIntroSeen');
    if (!seen) {
      setTimeout(() => {
        this.showIntro = true;
      }, 700);
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  closeIntro() {
    this.showIntro = false;
    localStorage.setItem('aiIntroSeen', 'true');
  }

  openChatFromIntro() {
    this.closeIntro();
    this.isOpen = true;
  }

  sendMessage() {
    if (!this.input.trim()) return;

    this.messages.push({ sender: 'user', text: this.input });
    this.input = '';

    setTimeout(() => {
      this.messages.push({
        sender: 'ai',
        text: 'Hi! I can help you explore jobs or answer questions 😊'
      });
    }, 600);
  }
}
