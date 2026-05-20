import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  /**
   * Uploads a file to GCP bucket.
   * @param file The file to upload.
   * @param bucketKey The GCP bucket key.
   * @param section The folder section within the bucket.
   * @param replace Optional flag to replace existing folder/files.
   */
  uploadFile(file: File, bucketKey: string, section: string, replace: boolean = false): Observable<{ success: boolean; message: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketKey', bucketKey);
    formData.append('section', section);
    formData.append('replace', replace ? 'true' : 'false');

    return this.http.post<{ success: boolean; message: string; url: string }>(
      `${this.baseUrl}/uploads/upload`,
      formData
    );
  }
}
