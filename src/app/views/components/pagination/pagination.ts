import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination implements OnChanges {

  @Input() total = 0;        // total records
  @Input() page = 1;         // current page
  @Input() limit = 10;       // items per page

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  totalPages: number[] = [];

  ngOnChanges() {
    this.calculatePages();
  }

  calculatePages() {
    const pages = Math.ceil(this.total / this.limit);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
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
