import { Component, EventEmitter, Input, Output } from '@angular/core';

export type PaginationVariant =
  | 'default'
  | 'text'
  | 'minimal';

export type PaginationSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface PaginationPage {
  number: number;
  disabled?: boolean;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {

  @Input() currentPage = 1;

  @Input() variant: PaginationVariant = 'default';

  @Input() size: PaginationSize = 'md';

  @Input() showFirstLast = false;

  @Input() showPreviousNext = true;

  @Input() showEllipsis = true;

  @Input() pageSize = 10;

  @Input() pageSizeOptions: number[] = [
    5,
    10,
    15,
    20,
    50
  ];

  @Input() totalItems = 100;

  @Input() showPageSize = true;

  @Input() showResultSummary = true;

  @Output() pageChange =
    new EventEmitter<number>();

  @Output() pageSizeChange =
    new EventEmitter<number>();


  get pages(): PaginationPage[] {

    const pages: PaginationPage[] = [];

    for (
      let page = 1;
      page <= this.totalPages;
      page++
    ) {

      pages.push({
        number: page
      });

    }

    return pages;
  }


  get totalPages(): number {

    if (this.totalItems === 0) {
      return 1;
    }

    return Math.ceil(
      this.totalItems / this.pageSize
    );
  }


  get startItem(): number {

    if (this.totalItems === 0) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;
  }


  get endItem(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.totalItems
    );
  }


  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.pageChange.emit(page);
  }


  goPrevious(): void {

    if (this.currentPage > 1) {
      this.goToPage(
        this.currentPage - 1
      );
    }
  }


  goNext(): void {

    if (
      this.currentPage < this.totalPages
    ) {
      this.goToPage(
        this.currentPage + 1
      );
    }
  }


  goFirst(): void {

    if (this.currentPage > 1) {
      this.goToPage(1);
    }
  }


  goLast(): void {

    if (
      this.currentPage < this.totalPages
    ) {
      this.goToPage(
        this.totalPages
      );
    }
  }


  onPageSizeChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    const newPageSize =
      Number(select.value);

    if (!newPageSize) {
      return;
    }

    this.pageSize = newPageSize;

    // Reset to first page when
    // page size changes.
    this.currentPage = 1;

    this.pageSizeChange.emit(
      this.pageSize
    );

    this.pageChange.emit(
      this.currentPage
    );
  }

}