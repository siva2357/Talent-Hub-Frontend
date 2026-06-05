import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  status: 'Published' | 'Draft';
  author: BlogAuthor;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.BASE}`,
      this.getHeaders()
    );
  }

  getPublishedPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.PUBLISHED}`
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.POST(slug)}`
    );
  }

  addPost(
    title: string, 
    description: string, 
    content: string, 
    category: string, 
    readTime: string, 
    status: 'Published' | 'Draft', 
    mediaType?: 'image' | 'video', 
    mediaUrl?: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.CREATE}`,
      { title, description, content, category, readTime, status, mediaType, mediaUrl },
      this.getHeaders()
    );
  }

  togglePostStatus(id: string): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.STATUS(id)}`,
      {},
      this.getHeaders()
    );
  }

  updatePost(
    id: string,
    title: string, 
    description: string, 
    content: string, 
    category: string, 
    readTime: string, 
    status: 'Published' | 'Draft', 
    mediaType?: 'image' | 'video', 
    mediaUrl?: string
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.DELETE(id)}`,
      { title, description, content, category, readTime, status, mediaType, mediaUrl },
      this.getHeaders()
    );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}${API_ENDPOINTS.BLOGS.DELETE(id)}`,
      this.getHeaders()
    );
  }
}
