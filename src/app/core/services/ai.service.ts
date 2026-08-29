import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
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
export class AIService extends BaseService {
  // Pointing to the Python FastAPI Server running locally on port 8000
  private readonly API_URL = 'http://127.0.0.1:8000';
  private readonly RAG_CHATBOT_URL = 'http://127.0.0.1:8000';
  private readonly CONTRACT_MATCHER_URL = 'http://127.0.0.1:8000';
  private readonly FEEDBACK_REVIEWER_URL = 'http://127.0.0.1:8000';
  private readonly TALENT_MATCHER_URL = 'http://127.0.0.1:8000';
  
  

  /**
   * Check the health status of the AI RAG server
   */
  getAIStatus(): Observable<AIStatusResponse> {
    return this.get<AIStatusResponse>(`${this.API_URL}/status`);
  }

  /**
   * Send a query to the AI RAG Chatbot
   */
  askChatbot(request: AIChatRequest): Observable<AIChatResponse> {
    return this.post<AIChatResponse>(`${this.API_URL}/chat`, request);
  }

  /**
   * Analyze freelancer profile against contracts
   */
  matchContracts(freelancerProfile: any, contracts: any[]): Observable<ContractMatchResponse> {
    const payload = {
      freelancer_profile: freelancerProfile,
      contracts: contracts
    };
    return this.post<ContractMatchResponse>(`${this.CONTRACT_MATCHER_URL}/analyze-contracts`, payload);
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
    return this.post<any>(`${this.TALENT_MATCHER_URL}/match-talent`, payload);
  }

  /**
   * Analyze a freelancer feedback report
   */
  analyzeFeedback(feedbackData: any): Observable<any> {
    const payload = {
      feedback: feedbackData
    };
    return this.post<any>(`${this.FEEDBACK_REVIEWER_URL}/analyze-feedback`, payload);
  }
}
