import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../shared/components/button/button.component';

import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/model/blog.model';
import { DateTimeHelper } from '../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;


  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  post: Blog | null = null;

  isLoading = true;

  error: string | null = null;

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      const id = params['id'];

      if (!id) {
        this.error = 'Blog not found';
        this.isLoading = false;
        return;
      }

      this.loadBlog(id);

    });

  }

  private loadBlog(id: string): void {

    this.isLoading = true;

    this.blogService
      .getBlogByIdPublic(id)
      .subscribe({
        next: (response) => {

          this.post = response.blog;

          this.isLoading = false;

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });

        },
        error: (error) => {

          console.error(error);

          this.error = 'Blog post not found';

          this.isLoading = false;

        }
      });

  }

  getReadTime(description: string): number {
  return Math.max(
    1,
    Math.ceil(description.split(' ').length / 200)
  );
}

}