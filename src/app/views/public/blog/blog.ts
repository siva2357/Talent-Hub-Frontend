import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BlogService } from '../../../core/services/blog.service';
import { BlogCard } from '../../../library/shared/components/blog-card/blog-card';
import { Blog } from '../../../core/models/blog.model';


interface BlogApiResponse {
  success: boolean;
  message?: string;
  blogs: Blog[];
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [BlogCard],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogPage implements OnInit {

  blogs: Blog[] = [];

  filteredBlogs: Blog[] = [];

  categories: string[] = [];

  selectedCategory = 'All';

  loading = false;

  errorMessage = '';

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllBlogs();
  }


  // =========================================================
  // LOAD BLOGS
  // =========================================================

  getAllBlogs(): void {

    this.loading = true;
    this.errorMessage = '';

    this.blogService.getAllPublishedBlogs().subscribe({

      next: (response: BlogApiResponse) => {

        if (!response?.success) {

          this.setError(
            response?.message || 'Unable to load blogs'
          );

          return;
        }

        this.blogs = response.blogs || [];

        this.buildCategories();

        this.filteredBlogs = [...this.blogs];

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Error fetching public blogs:',
          error
        );

        this.setError(
          error?.error?.message ||
          'Failed to load blogs'
        );
      }

    });
  }


  // =========================================================
  // BUILD CATEGORIES
  // =========================================================

  private buildCategories(): void {

    const categories = this.blogs
      .map(blog => blog.category?.trim())
      .filter(Boolean);

    this.categories = [
      ...new Set(categories)
    ];
  }


  // =========================================================
  // FILTER BLOGS
  // =========================================================

  filterByCategory(category: string): void {

    this.selectedCategory = category;

    if (category === 'All') {

      this.filteredBlogs = [...this.blogs];

      return;
    }

    this.filteredBlogs = this.blogs.filter(
      blog =>
        blog.category?.toLowerCase() ===
        category.toLowerCase()
    );
  }


  // =========================================================
  // BLOG DETAILS
  // =========================================================

  viewBlogDetails(id: string): void {

    if (!id) {
      return;
    }

    this.router.navigate([
      '/blog-details',
      id
    ]);
  }


  // =========================================================
  // ERROR HANDLING
  // =========================================================

  private setError(message: string): void {

    this.blogs = [];

    this.filteredBlogs = [];

    this.errorMessage = message;

    this.loading = false;
  }


  // =========================================================
  // TRACK BLOG
  // =========================================================

  trackByBlogId(
    index: number,
    blog: Blog
  ): string {

    return blog._id || index.toString();
  }

}