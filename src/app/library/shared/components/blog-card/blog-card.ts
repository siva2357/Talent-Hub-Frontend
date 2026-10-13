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


  // ============================================
  // VIEW DETAILS
  // ============================================

  onViewDetails(): void {

    if (!this.blog?._id) {
      return;
    }

    this.viewDetails.emit(this.blog._id);
  }


  // ============================================
  // DATE
  // ============================================

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


  // ============================================
  // CONTENT → EXCERPT
  // ============================================

  getExcerpt(): string {

    if (!this.blog?.content) {
      return '';
    }

    // Remove HTML if content contains rich text
    const plainText = this.blog.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!plainText) {
      return '';
    }

    // Keep card description short
    if (plainText.length <= 150) {
      return plainText;
    }

    return `${plainText.substring(0, 150).trim()}...`;
  }


  // ============================================
  // CALCULATE READ TIME
  // ============================================

  getReadTime(): string {

    if (!this.blog?.content) {
      return '1 min read';
    }

    const plainText = this.blog.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!plainText) {
      return '1 min read';
    }

    const words = plainText
      .split(/\s+/)
      .filter(Boolean)
      .length;

    // Average reading speed = 200 words/minute
    const minutes = Math.max(
      1,
      Math.ceil(words / 200)
    );

    return `${minutes} min read`;
  }

}