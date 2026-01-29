import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AiChabotComponent } from "./views/shared/ai-chabot-component/ai-chabot-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AiChabotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('Talent-Hub');

  // 👇 controls chatbot visibility
  private showAi = signal(true);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.evaluateRoute(event.urlAfterRedirects);
      }
    });
  }

  showAiChat() {
    return this.showAi();
  }

  private evaluateRoute(url: string) {
    const hiddenPrefixes = ['/admin', '/recruiter', '/jobSeeker'];
    const shouldHide = hiddenPrefixes.some(prefix =>
      url.startsWith(prefix)
    );

    this.showAi.set(!shouldHide);
  }
}
