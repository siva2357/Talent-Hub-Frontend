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

export interface ContractMatch {
  contract_id: string;
  contract_title: string;
  match_percentage: number;
  match_category: 'High' | 'Average' | 'Low';
  reasoning: string;
}

export interface ContractMatchResponse {
  matches: {
    results: ContractMatch[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  // Pointing to the Python FastAPI Server running locally on port 8000
  private readonly API_URL = 'http://127.0.0.1:8000';
  private readonly RAG_CHATBOT_URL = 'http://127.0.0.1:8000';
  private readonly CONTRACT_MATCHER_URL = 'http://127.0.0.1:8000';
  private readonly FEEDBACK_REVIEWER_URL = 'http://127.0.0.1:8000';
  private readonly TALENT_MATCHER_URL = 'http://127.0.0.1:8000';
  
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

  /**
   * Analyze freelancer profile against contracts
   */
  matchContracts(freelancerProfile: any, contracts: any[]): Observable<ContractMatchResponse> {
    const payload = {
      freelancer_profile: freelancerProfile,
      contracts: contracts
    };
    return this.http.post<ContractMatchResponse>(`${this.CONTRACT_MATCHER_URL}/analyze-contracts`, payload);
  }

  /**
   * Analyze talent against requirements
   */
  matchTalent(category: string, skills: string[], candidates: any[]): Observable<any> {
    const payload = {
      category: category,
      skills: skills,
      candidates: candidates
    };
    return this.http.post<any>(`${this.TALENT_MATCHER_URL}/match-talent`, payload);
  }

  /**
   * Analyze a freelancer feedback report
   */
  analyzeFeedback(feedbackData: any): Observable<any> {
    const payload = {
      feedback: feedbackData
    };
    return this.http.post<any>(`${this.FEEDBACK_REVIEWER_URL}/analyze-feedback`, payload);
  }
}
