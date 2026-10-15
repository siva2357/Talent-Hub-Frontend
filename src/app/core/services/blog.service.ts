
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService extends BaseService {

  private apiUrl = `${environment.apiGatewayUrl}/blogs`;

  // =========================================================
  // ADMIN APIs
  // =========================================================

  createBlog(data: any): Observable<any> {
    return this.post<any>(`${this.apiUrl}/admin`, data);
  }

  getAllBlogsAdmin(): Observable<any> {
    return this.get<any>(`${this.apiUrl}/admin`);
  }

  getBlogByIdAdmin(id: string): Observable<any> {
    return this.get<any>(`${this.apiUrl}/admin/${id}`);
  }

  updateBlog(id: string, data: any): Observable<any> {
    return this.put<any>(`${this.apiUrl}/admin/${id}`, data);
  }

  deleteBlog(id: string): Observable<any> {
    return this.delete<any>(`${this.apiUrl}/admin/${id}`);
  }


  // =========================================================
  // PUBLIC APIs
  // =========================================================

  getAllPublishedBlogs(): Observable<any> {
    return this.get<any>(this.apiUrl);
  }

  getBlogByIdPublic(id: string): Observable<any> {
    return this.get<any>(`${this.apiUrl}/${id}`);
  }

}
