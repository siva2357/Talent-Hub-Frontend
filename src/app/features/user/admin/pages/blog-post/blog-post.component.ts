import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlogService, BlogPost } from '../../../../../core/services/blog.service';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPostComponent implements OnInit {
  private blogService = inject(BlogService);
  private toastr = inject(ToastrService);

  posts: BlogPost[] = [];
  isFormOpen = false;

  // Form Fields
  isEditing = false;
  editId = '';
  title = '';
  description = '';
  content = '';
  category = 'Artificial Intelligence';
  readTime = '5 min read';
  status: 'Published' | 'Draft' = 'Published';

  // Media upload fields
  mediaType: 'image' | 'video' | null = null;
  mediaUrl: string | null = null;

  categories = [
    'Artificial Intelligence',
    'Services',
    'Workflow',
    'Technology',
    'Security'
  ];

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.blogService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      }
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.isEditing = false;
    this.isFormOpen = true;
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.description.trim() || !this.content.trim()) {
      this.toastr.warning('Please fill in all required fields.', 'Blog Management');
      return;
    }

    const typeArg = this.mediaType || undefined;
    const urlArg = this.mediaUrl || undefined;

    if (this.isEditing) {
      this.blogService.deletePost(this.editId);
      this.blogService.addPost(this.title, this.description, this.content, this.category, this.readTime, this.status, typeArg, urlArg);
      this.toastr.success('Blog post updated successfully!', 'Blog Management');
    } else {
      this.blogService.addPost(this.title, this.description, this.content, this.category, this.readTime, this.status, typeArg, urlArg);
      this.toastr.success('New blog post published successfully!', 'Blog Management');
    }

    this.closeFormModal();
    this.loadPosts();
  }

  editPost(post: BlogPost): void {
    this.isEditing = true;
    this.editId = post.id;
    this.title = post.title;
    this.description = post.description;
    this.content = post.content;
    this.category = post.category;
    this.readTime = post.readTime;
    this.status = post.status;
    this.mediaType = post.mediaType || null;
    this.mediaUrl = post.mediaUrl || null;
    this.isFormOpen = true;
  }

  deletePost(id: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deletePost(id);
      this.toastr.success('Blog post deleted successfully.', 'Blog Management');
      this.loadPosts();
    }
  }

  togglePublishStatus(id: string): void {
    this.blogService.togglePostStatus(id);
    this.toastr.info('Publication status toggled.', 'Blog Management');
    this.loadPosts();
  }

  onMediaSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.mediaUrl = e.target.result;
        this.toastr.success(`${file.name} loaded in preview.`, 'Media Upload');
      };
      reader.readAsDataURL(file);
    }
  }

  removeMedia(): void {
    this.mediaType = null;
    this.mediaUrl = null;
    this.toastr.info('Media attachment removed.', 'Media Upload');
  }

  resetForm(): void {
    this.isEditing = false;
    this.editId = '';
    this.title = '';
    this.description = '';
    this.content = '';
    this.category = 'Artificial Intelligence';
    this.readTime = '5 min read';
    this.status = 'Published';
    this.mediaType = null;
    this.mediaUrl = null;
  }

  closeFormModal(): void {
    this.resetForm();
    this.isFormOpen = false;
  }
}
