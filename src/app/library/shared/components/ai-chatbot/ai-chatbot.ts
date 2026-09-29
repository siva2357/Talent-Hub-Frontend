import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AIService } from '../../../../core/services/ai.service';
import { ChatMessage } from '../../../../core/models/ui.model';

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ai-chatbot.html',
  styleUrl: './ai-chatbot.css'
})
export class AiChatbot {

  isOpen = false;

  currentQuery = '';

  isLoading = false;

  messages: ChatMessage[] = [];

  constructor(
    private aiService: AIService
  ) { }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {

    const query = this.currentQuery.trim();

    if (!query || this.isLoading) {
      return;
    }

    // Add user's message immediately
    this.messages.push({
      text: query,
      isBot: false
    });

    // Clear input
    this.currentQuery = '';

    // Show AI loading state
    this.isLoading = true;

    // Call RAG / AI backend
    this.aiService.askChatbot({
      query,
      top_k: 3
    }).subscribe({

      next: (res) => {

        this.messages.push({
          text: res.summary,
          isBot: true
        });

        // Stop loading only after AI response
        this.isLoading = false;
      },

      error: (err) => {

        console.error('Chatbot error:', err);

        this.messages.push({
          text:
            'Sorry, I encountered an error. Please ensure the backend RAG server is running.',
          isBot: true
        });

        // Stop loading after error
        this.isLoading = false;
      }

    });
  }
}