import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UploadResponse } from '../models/upload-response.model';


@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  private API = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  uploadFile(
    file: File,
    bucketKey: string,
    section: string,
    userId?: string
  ) {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketKey', bucketKey);
    formData.append('section', section);

    let url = this.API + '/upload';

    if (userId) {
      formData.append('userId', userId);
      url = this.API + '/pre-login';
    }

    return this.http.post<UploadResponse>(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
