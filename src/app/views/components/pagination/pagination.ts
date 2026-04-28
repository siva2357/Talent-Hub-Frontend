import { Component, Input, Output, EventEmitter, OnChanges, HostListener } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination implements OnChanges {

  @Input() total = 0;
  @Input() page = 1;
  @Input() limit = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  totalPages: number[] = [];

  // ✅ track screen width reactively
  screenWidth = window.innerWidth;

  // ✅ listen to resize
  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnChanges() {
    this.calculatePages();
  }

  calculatePages() {
    const pages = Math.ceil(this.total / this.limit);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  // ✅ responsive visible pages
  get visiblePages(): number[] {
    const total = this.totalPages.length;

    let maxVisible = 5; // large

    if (this.screenWidth < 576) {
      maxVisible = 2; // small
    } else if (this.screenWidth < 992) {
      maxVisible = 3; // medium
    }

    const half = Math.floor(maxVisible / 2);

    let start = this.page - half;
    let end = this.page + half;

    if (start < 1) {
      start = 1;
      end = Math.min(maxVisible, total);
    }

    if (end > total) {
      end = total;
      start = Math.max(1, total - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages.length) return;
    this.page = p;
    this.pageChange.emit(this.page);
  }

  prev() {
    this.changePage(this.page - 1);
  }

  next() {
    this.changePage(this.page + 1);
  }

  changeLimit(event: any) {
    this.limit = +event.target.value;
    this.limitChange.emit(this.limit);
    this.page = 1;
    this.pageChange.emit(this.page);
  }

  get start() {
    return (this.page - 1) * this.limit + 1;
  }

  get end() {
    return Math.min(this.page * this.limit, this.total);
  }
}
