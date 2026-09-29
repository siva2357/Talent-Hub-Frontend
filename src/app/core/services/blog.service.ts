
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService extends BaseService {

  private apiUrl = 'http://localhost:5000/api/blogs';

  // =========================================================
  // ADMIN APIs
  // =========================================================

  /**
   * Create a new blog
   * POST /api/blogs/admin
   */
  createBlog(data: any): Observable<any> {
    return this.post<any>(`${this.apiUrl}/admin`, data);
  }

  /**
   * Get all blogs for admin
   * GET /api/blogs/admin
   */
  getAllBlogsAdmin(): Observable<any> {
    return this.get<any>(`${this.apiUrl}/admin`);
  }

  /**
   * Get blog by ID for admin
   * GET /api/blogs/admin/:id
   */
  getBlogByIdAdmin(id: string): Observable<any> {
    return this.get<any>(`${this.apiUrl}/admin/${id}`);
  }

  /**
   * Update blog
   * PUT /api/blogs/admin/:id
   */
  updateBlog(id: string, data: any): Observable<any> {
    return this.put<any>(`${this.apiUrl}/admin/${id}`, data);
  }

  /**
   * Delete blog
   * DELETE /api/blogs/admin/:id
   */
  deleteBlog(id: string): Observable<any> {
    return this.delete<any>(`${this.apiUrl}/admin/${id}`);
  }


  // =========================================================
  // PUBLIC APIs
  // =========================================================

  /**
   * Get all published/public blogs
   * GET /api/blogs
   */
  getAllPublishedBlogs(): Observable<any> {
    return this.get<any>(this.apiUrl);
  }

  /**
   * Get a single public blog by ID
   * GET /api/blogs/:id
   */
  getBlogByIdPublic(id: string): Observable<any> {
    return this.get<any>(`${this.apiUrl}/${id}`);
  }

}
