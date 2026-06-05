import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost } from '../../../core/services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);

  selectedCategory: string = 'All Posts';
  
  categories = [
    'All Posts',
    'Artificial Intelligence',
    'Services',
    'Workflow',
    'Technology',
    'Security'
  ];

  blogPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.blogService.getPublishedPosts().subscribe({
      next: (posts) => {
        this.blogPosts = posts;
      },
      error: (err) => {
        console.error('Failed to load blog posts:', err);
      }
    });
  }

  get filteredPosts() {
    if (this.selectedCategory === 'All Posts') {
      return this.blogPosts;
    }
    return this.blogPosts.filter(post => post.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  onCategoryChange(event: any) {
    const category = event.target.value;
    this.selectCategory(category);
  }
}
