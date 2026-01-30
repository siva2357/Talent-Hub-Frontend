import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface ChatResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {

  private apiUrl = environment.CHATBOT_API;

  constructor(private http: HttpClient) {}

  askQuestion(query: string, topK: number = 3): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, {
      query,
      top_k: topK
    });
  }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
