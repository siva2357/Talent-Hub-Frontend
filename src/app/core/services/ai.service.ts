import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AIChatRequest {
  query: string;
  top_k?: number;
}

export interface AIChatResponse {
  query: string;
  summary: string;
}

export interface AIStatusResponse {
  status: string;
  service: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  // Pointing to the Python FastAPI Server running locally on port 8000
  private readonly API_URL = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  /**
   * Check the health status of the AI RAG server
   */
  getAIStatus(): Observable<AIStatusResponse> {
    return this.http.get<AIStatusResponse>(`${this.API_URL}/status`);
  }

  /**
   * Send a query to the AI RAG Chatbot
   */
  askChatbot(request: AIChatRequest): Observable<AIChatResponse> {
    return this.http.post<AIChatResponse>(`${this.API_URL}/chat`, request);
  }
}
