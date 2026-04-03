import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../../core/services/chatbot-service';


interface ChatMessage {
  sender: 'user' | 'ai';
  text?: string;        // for user messages
  paragraph?: string;   // for AI main answer
  points?: string[];    // for AI bullet points
  raw?: string;         // optional (debug)
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

  showIntro = false;
  loading = false;

  constructor(private chatbotService: ChatbotService) {}

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
  if (!this.input.trim() || this.loading) return;

  const userMessage = this.input;

  // push user message
  this.messages.push({
    sender: 'user',
    text: userMessage
  });

  this.input = '';
  this.loading = true;

  this.chatbotService.askQuestion(userMessage).subscribe({
next: (res: any) => {
  const answer = res.data?.answer || '';

  const formatted = this.formatAIResponse(answer);

      this.messages.push({
        sender: 'ai',
        paragraph: formatted.paragraph,
        points: formatted.points,
        raw: res.answer
      });

      this.loading = false;
      this.scrollToBottom();
    },
    error: () => {
      this.messages.push({
        sender: 'ai',
        paragraph: 'Sorry, something went wrong. Please try again.',
        points: []
      });
      this.loading = false;
    }
  });
}




private formatAIResponse(text: string): { paragraph: string; points: string[] } {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const paragraphLines: string[] = [];
  const points: string[] = [];

  for (let line of lines) {
    // remove markdown bold/italic markers
    line = line.replace(/\*\*/g, '').replace(/__/g, '').replace(/\*/g, '');

    if (
      line.startsWith('-') ||
      line.startsWith('•') ||
      /^\d+\./.test(line)
    ) {
      points.push(line.replace(/^(-|•|\d+\.)\s*/, ''));
    } else if (!line.toLowerCase().includes('key aspects')) {
      paragraphLines.push(line);
    }
  }

  return {
    paragraph: paragraphLines.join(' '),
    points
  };
}




  private scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.ai-messages');
      el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }
}
