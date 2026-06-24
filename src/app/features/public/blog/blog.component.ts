import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/model/blog.model';
import { DateTimeHelper } from '../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;


  private blogService = inject(BlogService);

  selectedCategory = 'All Posts';

  blogPosts: Blog[] = [];

  categories = [
    'All Posts',
    'Technology',
    'Artificial Intelligence',
    'Education',
    'Career',
    'Business',
    'Programming',
    'Security',
    'Other'
  ];

  getReadTime(description: string): number {
  return Math.max(
    1,
    Math.ceil(description.split(' ').length / 200)
  );
}

  ngOnInit(): void {

    this.blogService
      .getPublishedBlogs()
      .subscribe({
        next: (response) => {
          this.blogPosts = response.blogs;
        },
        error: (error) => {
          console.error(
            'Failed to load blogs',
            error
          );
        }
      });

  }

  get filteredPosts(): Blog[] {

    if (this.selectedCategory === 'All Posts') {
      return this.blogPosts;
    }

    return this.blogPosts.filter(
      post => post.category === this.selectedCategory
    );

  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  onCategoryChange(event: Event): void {

    const target =
      event.target as HTMLSelectElement;

    this.selectedCategory =
      target.value;

  }

}