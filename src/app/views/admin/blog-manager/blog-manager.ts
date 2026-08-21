import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';

@Component({
  selector: 'app-blog-manager',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './blog-manager.html',
  styleUrl: './blog-manager.css'
})
export class BlogManager implements OnInit {
  blogs: any[] = [];
  isLoading = true;

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.isLoading = true;
    this.blogService.getAllBlogsAdmin().subscribe({
      next: (res) => {
        if (res.success) {
          this.blogs = res.blogs || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching blogs', err);
        this.isLoading = false;
      }
    });
  }

  deleteBlog(id: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.blogs = this.blogs.filter(b => b._id !== id);
          }
        },
        error: (err) => console.error('Error deleting blog', err)
      });
    }
  }
}

