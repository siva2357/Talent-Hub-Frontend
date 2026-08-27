import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FeedbackData {
  contractId: string;
  freelancerId: string;
  overallRating: number;
  categories: {
    qualityOfWork: number;
    requirementsAndDeliverables: number;
    communication: number;
    timeliness: number;
    behaviorAndProfessionalism: number;
  };
  clientComments: string;
  pros: string[];
  cons: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = `${environment.apiGatewayUrl}/feedback`;

  constructor(private http: HttpClient) { }

  submitFeedback(data: FeedbackData): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, data);
  }

  getFeedbackByContract(contractId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/contract/${contractId}`);
  }
}
