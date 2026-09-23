import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
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
export class FeedbackService extends BaseService {
  private apiUrl = `${environment.apiGatewayUrl}/feedback`;

  

  submitFeedback(data: FeedbackData): Observable<any> {
    return this.post(`${this.apiUrl}/submit`, data);
  }

  getFeedbackByContract(contractId: string): Observable<any> {
    return this.get(`${this.apiUrl}/contract/${contractId}`);
  }
}
