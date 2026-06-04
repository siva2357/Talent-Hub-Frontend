import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  // State to hold verified check-in evidence from capture page
  public lastCapturedInfo: {
    faceImage: string;
    location: string;
    faceMatch: boolean;
  } | null = null;

  public activeContractId: string | null = null;

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ==========================================
  // Attendance Endpoints
  // ==========================================

  checkIn(data: { contractId: string; location: string; faceImage: string; faceMatch: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.ATTENDANCE.CHECK_IN}`, data, this.getHeaders());
  }

  checkOut(data: { contractId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.ATTENDANCE.CHECK_OUT}`, data, this.getHeaders());
  }

  getTodayStatus(contractId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.ATTENDANCE.STATUS(contractId)}`, this.getHeaders());
  }

  getAttendanceOverview(contractId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.ATTENDANCE.OVERVIEW(contractId)}`, this.getHeaders());
  }

  // ==========================================
  // Timesheet Endpoints
  // ==========================================

  getClientTimesheets(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.ATTENDANCE.TIMESHEETS_CLIENT}`, this.getHeaders());
  }

  approveTimesheet(timesheetId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${API_ENDPOINTS.ATTENDANCE.TIMESHEET_APPROVE(timesheetId)}`, {}, this.getHeaders());
  }
}
