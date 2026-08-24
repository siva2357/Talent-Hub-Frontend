import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:5000/api/blogs/admin';

  constructor(private http: HttpClient) { }

  createBlog(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getAllBlogsAdmin(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getBlogByIdAdmin(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateBlog(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
