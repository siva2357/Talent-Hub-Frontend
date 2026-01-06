import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin-service';

@Component({
  selector: 'app-support-requests',
  standalone: true,
  imports: [FormsModule], // ✅ REQUIRED
  templateUrl: './support-requests.html',
  styleUrl: './support-requests.css',
})
export class SupportRequests {

  selectedFile!: File;

  constructor(private adminService: AdminService) {}

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadMcqs() {
    console.log('Upload clicked');

    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }

    console.log('File:', this.selectedFile.name);

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.adminService.uploadMcqs(formData).subscribe({
      next: res => {
        alert(`Uploaded ${res.inserted} MCQs`);
      },
      error: err => {
        console.error(err);
        alert(err.error?.message || 'Upload failed');
      }
    });
  }
}
