import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UploadResponse } from '../models/upload-response.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  private API = environment.apiGatewayUrl;


  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  /* ================= JWT HEADER ================= */
  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.get('JWT_Token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  uploadFile(
    file: File,
    bucketKey: string,
    section: string,
    replace = false
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketKey', bucketKey);
    formData.append('section', section);
    formData.append('replace', String(replace));

    return this.http.post<UploadResponse>(
      this.API + '/upload',
      formData,
      {
        headers: this.getAuthHeaders(),
        reportProgress: true,
        observe: 'events'
      }
    );
  }
}
