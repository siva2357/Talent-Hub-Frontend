import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateBlogDTO, UpdateBlogDTO } from '../dtos/blogPost.dto';
import { Blog } from '../models/blog.model';



@Injectable({
  providedIn: 'root',
})
export class BlogService {
    private baseUrl = environment.apiGatewayUrl;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('JWT_Token');
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }


  createBlog(
    payload: CreateBlogDTO
  ): Observable<{ success: boolean; message: string; data: Blog }> {
    return this.http
      .post<{ success: boolean; message: string; data: Blog }>(
        `${this.baseUrl}/blog`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }



  // UPDATE BLOG (ADMIN)
  // =========================
  updateBlog(
    blogId: string,
    payload: UpdateBlogDTO
  ): Observable<{ success: boolean; message: string; data: Blog }> {
    return this.http
      .put<{ success: boolean; message: string; data: Blog }>(
        `${this.baseUrl}/blog/${blogId}`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  // =========================
  // DELETE BLOG (ADMIN)
  // =========================
  deleteBlog(
    blogId: string
  ): Observable<{ success: boolean; message: string }> {
    return this.http
      .delete<{ success: boolean; message: string }>(
        `${this.baseUrl}/blog/${blogId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  // =========================
  // GET ADMIN BLOGS
  // =========================
  getAdminBlogs(): Observable<{
    success: boolean;
    count: number;
    data: Blog[];
  }> {
    return this.http
      .get<{
        success: boolean;
        count: number;
        data: Blog[];
      }>(`${this.baseUrl}/blog/admin`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }


    // =========================
  // GET BLOG BY ID (ADMIN)
  // =========================
  getBlogById(
    blogId: string
  ): Observable<{ success: boolean; data: Blog }> {
    return this.http
      .get<{ success: boolean; data: Blog }>(
        `${this.baseUrl}/blog/${blogId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }



  // =========================
  // PUBLIC BLOG LIST
  // =========================
  getPublicBlogs(): Observable<{
    success: boolean;
    count: number;
    data: Blog[];
  }> {
    return this.http
      .get<{
        success: boolean;
        count: number;
        data: Blog[];
      }>(`${this.baseUrl}/blogs`)
      .pipe(catchError(this.handleError));
  }


  // =========================
  // PUBLIC BLOG BY ID
  // =========================
  getPublicBlogById(
    blogId: string
  ): Observable<{ success: boolean; data: Blog }> {
    return this.http
      .get<{ success: boolean; data: Blog }>(
        `${this.baseUrl}/blogs/${blogId}`
      )
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }

}
