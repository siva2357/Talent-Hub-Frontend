import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';


@Component({
  selector: 'app-blog-details',
  imports: [RouterLink],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css'
})
export class BlogDetails implements OnInit {

  blog: any = null;

  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.getBlogDetails();
  }

  /**
   * Get blog ID from route and fetch blog details
   */
  getBlogDetails(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Blog ID not found';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.blogService.getBlogByIdPublic(id).subscribe({

      next: (response) => {

        if (response?.success) {
          this.blog = response.blog;
        } else {
          this.blog = null;
          this.errorMessage =
            response?.message || 'Blog not found';
        }

        this.loading = false;
      },

      error: (error) => {

        console.error('Error fetching blog details:', error);

        this.blog = null;

        this.errorMessage =
          error?.error?.message || 'Failed to load blog';

        this.loading = false;
      }

    });
  }

}