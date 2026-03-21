import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";
import { Buttons } from "../../../components/buttons/buttons";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFields } from "../../../components/input-fields/input-fields";
import { FilePreview } from "../../../shared/file-preview/file-preview";
import { FileUpload } from "../../../shared/file-upload/file-upload";
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../core/enums/upload-section.constant';
import { BlogService } from '../../../../core/services/blogPost-service';
import { Blog } from '../../../../core/models/blog.model';

@Component({
  selector: 'app-blog-page',
  imports: [CommonModule, Table, Pagination, Buttons, FormsModule, InputFields, ReactiveFormsModule, FilePreview, FileUpload],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
})
export class BlogPage  implements OnInit {
  // -------------------------
  // PAGINATION STATE
  // -------------------------
  page = 1;
  limit = 5;
  total = 0;

  paginatedBlogs: any[] = [];

categories = ['Industry News', 'Interview Tips', 'Recruitment', 'Career', 'Technology'];
statuses = ['Draft', 'Published', 'Archived'];
searchText = '';
selectedCategory = '';
selectedStatus = '';
isImage(url: string) {
  return url?.match(/\.(jpeg|jpg|png|webp)$/i);
}

isVideo(url: string) {
  return url?.match(/\.(mp4|webm|ogg)$/i);
}

selectedDate = '';
filteredBlogs: any[] = [];

isLoading = false;
blogForm!: FormGroup;
isEditMode = false;
selectedBlog: Blog | null = null;
BucketKey = BucketKey;
UploadSection = UploadSection;

selectedDeleteBlogId: string | null = null;

  columns: any[] = [];
blogs: Blog[] = [];
selectedBlogId:string | null = null;

  @ViewChild('valueTemplate', { static: true })
  public valueTemplateRef!: TemplateRef<any>;

  @ViewChild('categoryTemplate', { static: true })
  public categoryTemplateRef!: TemplateRef<any>;

  @ViewChild('imageTemplate', { static: true })
  public imageTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;





isFiltering = false;


  constructor(private fb: FormBuilder, private blogService:BlogService) {
this.blogForm = this.fb.group({
  blogTitle: ['', [Validators.required, Validators.minLength(3)]],
  category: ['', Validators.required],
  blogDescription: ['', [Validators.required, Validators.minLength(10)]],
  blogMedia: ['', Validators.required] // image/video URL (GCP)
});
  }

  ngOnInit() {
    this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Image', template: this.imageTemplateRef },
      { name: 'Title', prop: 'blogTitle' },
      { name: 'Category',  template: this.categoryTemplateRef  },
      { name: 'Posted Date', prop: 'createdAt' },
      { name: 'Action', template: this.actionsTemplateRef, center: true },
    ];
this.getBlogs()

  }


    // -------------------------
  // PAGINATION LOGIC
  // -------------------------
applyPagination() {
  const source = this.isFiltering ? this.filteredBlogs : this.blogs;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedBlogs = source.slice(start, end);
}

  onPageChange(p: number) {
    this.page = p;
    this.applyPagination();
  }

  onLimitChange(l: number) {
    this.limit = l;
    this.page = 1;
    this.applyPagination();
  }





onLogoUploaded(url: string) {
  this.blogForm.patchValue({
    blogMedia: url
  });
}

afterSave() {
  this.blogForm.reset();
  this.selectedBlogId = null;
  this.isEditMode = false;
  const modal = document.getElementById('blogFormModal');
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  // reload list
  this.getBlogs();
}




getBlogs() {
  this.isLoading = true;

  this.blogService.getAdminBlogs().subscribe({
    next: (res) => {
      this.blogs = res.data || [];

      this.total = this.blogs.length;   // ✅ set total
      this.applyPagination();               // ✅ IMPORTANT

      this.isLoading = false;
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}





filteredCompanies: any[] = [];

applyFilters() {
  let data = [...this.blogs];

  if (this.searchText) {
    data = data.filter(b =>
      b. blogTitle.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCategory) {
    data = data.filter(b => b.category === this.selectedCategory);
  }

  //   if (this.selectedStatus) {
  //   data = data.filter(b => b.status === this.selectedStatus);
  // }

  if (this.selectedDate) {
    data = data.filter(b => b.createdAt === this.selectedDate);
  }

  this.filteredBlogs = data;
  this.isFiltering = true;

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

resetFilters() {
  this.searchText = '';
  this.selectedCategory = '';
  this.selectedStatus = '';
  this.selectedDate = '';

  this.filteredBlogs = [];
  this.isFiltering = false;

  this.total = this.blogs.length;
  this.page = 1;

  this.applyPagination();
}



getActiveFilters(): { key: string; label: string }[] {
  const filters: any[] = [];

  if (this.searchText) filters.push({ key: 'search', label: this.searchText });
  if (this.selectedCategory) filters.push({ key: 'category', label: this.selectedCategory });
  if (this.selectedStatus) filters.push({ key: 'status', label: this.selectedStatus });
  if (this.selectedDate) filters.push({ key: 'date', label: this.selectedDate });

  return filters;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'category') this.selectedCategory = '';
  if (key === 'status') this.selectedStatus = '';
  if (key === 'date') this.selectedDate = '';

  this.applyFilters();
}




openAddModal() {
  this.isEditMode = false;
  this.selectedBlogId = null;
  this.blogForm.reset();
}


// =============================
// OPEN EDIT MODAL
// =============================
openEditModal(blog: Blog) {
  this.isEditMode = true;
  this.selectedBlogId = blog._id;

  this.blogForm.patchValue({
    blogTitle: blog.blogTitle,
    category: blog.category,
    blogDescription: blog.blogDescription,
    blogMedia: blog.blogMedia
  });
}


onSubmit() {
  if (this.blogForm.invalid) {
    this.blogForm.markAllAsTouched();
    return;
  }

  const payload = this.blogForm.value;

  if (this.isEditMode && this.selectedBlogId) {
    // UPDATE
    this.blogService.updateBlog(this.selectedBlogId, payload)
      .subscribe(() => {
        this.afterSave();
      });
  } else {
    // CREATE
    this.blogService.createBlog(payload)
      .subscribe(() => {
        this.afterSave();
      });
  }
}


// =============================
// OPEN VIEW MODAL
// =============================
openViewModal(blog: Blog) {
  this.selectedBlog = blog;
}


// =============================
// OPEN DELETE MODAL
// =============================
openDeleteModal(blog: Blog) {
  this.selectedDeleteBlogId = blog._id;
  this.selectedBlog = blog; // optional (for UI display)
}



// =============================
// CONFIRM DELETE
// =============================
confirmDelete() {
  if (!this.selectedDeleteBlogId) return;

  this.blogService.deleteBlog(this.selectedDeleteBlogId)
    .subscribe({
      next: () => {

        // close modal
        const modalEl = document.getElementById('deleteBlogModal');
        if (modalEl) {
          (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();
        }

        // reset
        this.selectedDeleteBlogId = null;

        // refresh list
        this.getBlogs();
      },
      error: (err) => {
        console.error(err);
      }
    });
}

}
