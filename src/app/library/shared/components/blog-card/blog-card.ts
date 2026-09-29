import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Blog } from '../../../../core/models/blog.model';



@Component({
  selector: 'app-blog-card',
  standalone: true,
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.css'
})
export class BlogCard {

  @Input({ required: true })
  blog!: Blog;

  @Output()
  viewDetails = new EventEmitter<string>();

  onViewDetails(): void {

    if (!this.blog?._id) {
      return;
    }

    this.viewDetails.emit(this.blog._id);
  }

  formatDate(date?: string): string {

    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getReadTime(): string {

    if (this.blog?.readTime) {
      return `${this.blog.readTime} min read`;
    }

    return '5 min read';
  }
}