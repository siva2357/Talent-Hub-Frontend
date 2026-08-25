import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-chatbot.html',
  styleUrl: './ai-chatbot.css'
})
export class AiChatbot {
  isOpen: boolean = false;

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }
}
