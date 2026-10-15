import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/models/blog.model';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css'
})
export class BlogDetails implements OnInit {

  blog: Blog | null = null;
  relatedBlogs: Blog[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getBlogDetails(id);
      } else {
        this.errorMessage = 'Blog ID not found';
      }
    });
  }

  // =========================================================
  // LOAD BLOG DETAILS (LIVE API)
  // =========================================================

  getBlogDetails(id: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.blogService.getBlogByIdPublic(id).subscribe({
      next: (response) => {
        if (response?.success && response.blog) {
          this.blog = response.blog;
          this.loadRelatedBlogs(id);
        } else {
          this.blog = null;
          this.errorMessage = response?.message || 'Blog not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching blog details:', error);
        this.blog = null;
        this.errorMessage = error?.error?.message || 'Failed to load blog';
        this.loading = false;
      }
    });
  }

  // =========================================================
  // LOAD RELATED BLOGS (LIVE API)
  // =========================================================

  loadRelatedBlogs(currentId: string): void {
    this.blogService.getAllPublishedBlogs().subscribe({
      next: (response) => {
        if (response?.success && response.blogs) {
          this.relatedBlogs = response.blogs
            .filter((b: Blog) => b._id !== currentId)
            .slice(0, 2);
        }
      },
      error: (err) => {
        console.error('Error fetching related blogs:', err);
      }
    });
  }

  // =========================================================
  // FORMATTING HELPERS
  // =========================================================

  formatDate(date?: string): string {
    if (!date) return '';
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getReadTime(content?: string): string {
    const text = (content || this.blog?.content || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) return '2 min read';
    const words = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }

  getExcerpt(content?: string): string {
    const text = (content || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) return '';
    return text.length > 130 ? `${text.substring(0, 130).trim()}...` : text;
  }

  viewRelatedBlog(id: string): void {
    this.router.navigate(['/blog-details', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}