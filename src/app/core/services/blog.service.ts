import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { Blog } from '../model/blog.model';
import { CreateBlogDto, UpdateBlogDto } from '../DTOs/blog.dto';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private http = inject(HttpClient);

  private readonly baseUrl =
    environment.apiGatewayUrl;

  private getHeaders() {

    const token = localStorage.getItem('th_token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };

  }

  // ==========================
  // PUBLIC
  // ==========================

  getPublishedBlogs(): Observable<{
    success: boolean;
    blogs: Blog[];
  }> {

    return this.http.get<{
      success: boolean;
      blogs: Blog[];
    }>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.BASE}`
    );

  }

  getBlogByIdPublic(
    id: string
  ): Observable<{
    success: boolean;
    blog: Blog;
  }> {

    return this.http.get<{
      success: boolean;
      blog: Blog;
    }>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.BY_ID(id)}`
    );

  }

  // ==========================
  // ADMIN
  // ==========================

  getAllBlogsAdmin(): Observable<{
    success: boolean;
    blogs: Blog[];
  }> {

    return this.http.get<{
      success: boolean;
      blogs: Blog[];
    }>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.ADMIN}`,
      this.getHeaders()
    );

  }

  getBlogByIdAdmin(
    id: string
  ): Observable<{
    success: boolean;
    blog: Blog;
  }> {

    return this.http.get<{
      success: boolean;
      blog: Blog;
    }>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.ADMIN_BY_ID(id)}`,
      this.getHeaders()
    );

  }

  createBlog(
    dto: CreateBlogDto
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.ADMIN}`,
      dto,
      this.getHeaders()
    );

  }

  updateBlog(
    id: string,
    dto: UpdateBlogDto
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.ADMIN_BY_ID(id)}`,
      dto,
      this.getHeaders()
    );

  }

  deleteBlog(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.ADMIN_BY_ID(id)}`,
      this.getHeaders()
    );

  }

}