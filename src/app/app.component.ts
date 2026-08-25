import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiChatbot } from './library/shared/components/ai-chatbot/ai-chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AiChatbot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}