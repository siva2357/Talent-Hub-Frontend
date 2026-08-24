import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadBucket, UploadSection } from '../enums/upload.enum';

export interface UploadResponse {
  success: boolean;
  message: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly UPLOAD_API = 'http://localhost:5000/api/uploads/upload';

  constructor(private http: HttpClient) { }

  /**
   * Uploads a file to the specified bucket and section.
   * @param file The file to upload
   * @param bucketKey The bucket enum value
   * @param section The section enum value
   * @param subfolder Optional subfolder for organization
   * @param replace Whether to replace existing files in that folder
   */
  uploadFile(
    file: File, 
    bucketKey: UploadBucket, 
    section: UploadSection, 
    subfolder: string = '', 
    replace: boolean = false
  ): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketKey', bucketKey);
    formData.append('section', section);
    formData.append('subfolder', subfolder);
    formData.append('replace', replace.toString());

    return this.http.post<UploadResponse>(this.UPLOAD_API, formData);
  }
}
