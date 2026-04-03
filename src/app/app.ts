import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiChabotComponent } from "./views/components/ai-chabot-component/ai-chabot-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AiChabotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('Talent-Hub');

  // chatbot always visible
  showAiChat = signal(true);

}
