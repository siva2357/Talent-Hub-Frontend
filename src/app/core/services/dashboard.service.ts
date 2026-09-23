import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {
  private apiUrl = 'http://localhost:5000/api/dashboard';

  getDashboardStats(): Observable<any> {
    return this.get(`${this.apiUrl}/stats`);
  }
}
