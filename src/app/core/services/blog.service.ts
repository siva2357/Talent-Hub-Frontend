import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService extends BaseService {
  private apiUrl = 'http://localhost:5000/api/blogs/admin';

  

  createBlog(data: any): Observable<any> {
    return this.post<any>(this.apiUrl, data);
  }

  getAllBlogsAdmin(): Observable<any> {
    return this.get<any>(this.apiUrl);
  }

  getBlogByIdAdmin(id: string): Observable<any> {
    return this.get<any>(`${this.apiUrl}/${id}`);
  }

  updateBlog(id: string, data: any): Observable<any> {
    return this.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteBlog(id: string): Observable<any> {
    return this.delete<any>(`${this.apiUrl}/${id}`);
  }
}
