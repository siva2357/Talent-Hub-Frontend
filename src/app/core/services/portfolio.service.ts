import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfileService } from './profile.service';

export interface PortfolioMedia {
  _id?: string;
  mediaType: 'image' | 'video';
  url: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  role: string;
  projectType: string;
  tags: string[];
  media: PortfolioMedia[];
  projectUrl?: string;
  createdDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private http = inject(HttpClient);
  private profileService = inject(ProfileService);
  private readonly baseUrl = environment.apiGatewayUrl;

  getPortfolioItems(): Observable<PortfolioItem[]> {
    return this.profileService.getMyProfile().pipe(
      map(res => {
        if (res.success && res.profile && (res.profile as any).professionalDetails?.portfolio) {
          return (res.profile as any).professionalDetails.portfolio.map((item: any) => this.mapToPortfolioItem(item));
        }
        return [];
      })
    );
  }

  addPortfolioItem(item: {
    title: string;
    description: string;
    role: string;
    projectType: string;
    tags: string[];
    media: PortfolioMedia[];
    projectUrl?: string;
  }): Observable<{ success: boolean; item: any }> {
    return this.http.post<{ success: boolean; item: any }>(`${this.baseUrl}/profile/portfolio`, item);
  }

  updatePortfolioItem(id: string, item: {
    title?: string;
    description?: string;
    role?: string;
    projectType?: string;
    tags?: string[];
    media?: PortfolioMedia[];
    projectUrl?: string;
  }): Observable<{ success: boolean; item: any }> {
    return this.http.put<{ success: boolean; item: any }>(`${this.baseUrl}/profile/portfolio/${id}`, item);
  }

  deletePortfolioItem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/profile/portfolio/${id}`);
  }

  private mapToPortfolioItem(item: any): PortfolioItem {
    return {
      id: item._id || item.id,
      title: item.title,
      description: item.description || '',
      role: item.role || '',
      projectType: item.projectType || '',
      tags: item.tags || item.technologies || [],
      media: item.media || (item.imageUrl ? [{ mediaType: 'image', url: item.imageUrl }] : []),
      projectUrl: item.projectUrl || '',
      createdDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : item.createdDate || ''
    };
  }
}
