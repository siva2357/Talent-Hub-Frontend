import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BlogService, BlogPost } from '../../../core/services/blog.service';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  post: BlogPost | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.isLoading = true;
        this.blogService.getPostBySlug(slug).subscribe({
          next: (postData) => {
            this.post = postData;
            this.isLoading = false;
            window.scrollTo(0, 0);
          },
          error: (err) => {
            console.error('Failed to load blog details:', err);
            this.error = 'Blog post not found.';
            this.isLoading = false;
          }
        });
      }
    });
  }
}
