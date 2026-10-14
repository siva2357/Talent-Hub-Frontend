import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {
  private apiUrl = `${environment.apiGatewayUrl}/dashboard`;

  getDashboardStats(): Observable<any> {
    return this.get(`${this.apiUrl}/stats`);
  }
}
