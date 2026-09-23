import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { PaginationVariant, PaginationSize, PaginationPage } from '../../../../core/models/ui.model';
export type {  PaginationVariant, PaginationSize, PaginationPage  };

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


  /* =========================================================
     PAGES
     ========================================================= */

  get pages(): PaginationPage[] {

    const totalPages = this.totalPages;

    /*
     * Show every page when ellipsis is disabled
     * or when there are only a few pages.
     */
    if (!this.showEllipsis || totalPages <= 7) {

      return Array.from(
        { length: totalPages },
        (_, index) => ({
          number: index + 1
        })
      );

    }


    const currentPage = Math.min(
      Math.max(this.currentPage, 1),
      totalPages
    );


    const pageNumbers = new Set<number>();


    /*
     * Always show first page.
     */
    pageNumbers.add(1);


    /*
     * Show pages around current page.
     */
    for (
      let page = currentPage - 1;
      page <= currentPage + 1;
      page++
    ) {

      if (
        page > 1 &&
        page < totalPages
      ) {
        pageNumbers.add(page);
      }

    }


    /*
     * Always show last page.
     */
    pageNumbers.add(totalPages);


    const sortedPages =
      Array.from(pageNumbers)
        .sort((a, b) => a - b);


    const result: PaginationPage[] = [];

    let previousPage = 0;


    for (const page of sortedPages) {

      /*
       * Add ellipsis when there is a gap.
       */
      if (
        previousPage &&
        page - previousPage > 1
      ) {

        result.push({
          number: -1,
          ellipsis: true
        });

      }


      result.push({
        number: page
      });


      previousPage = page;
    }


    return result;
  }


  /* =========================================================
     TOTAL PAGES
     ========================================================= */

  get totalPages(): number {

    if (this.totalItems === 0) {
      return 1;
    }

    return Math.ceil(
      this.totalItems / this.pageSize
    );
  }


  /* =========================================================
     START ITEM
     ========================================================= */

  get startItem(): number {

    if (this.totalItems === 0) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;
  }


  /* =========================================================
     END ITEM
     ========================================================= */

  get endItem(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.totalItems
    );
  }


  /* =========================================================
     GO TO PAGE
     ========================================================= */

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


  /* =========================================================
     PREVIOUS
     ========================================================= */

  goPrevious(): void {

    if (this.currentPage > 1) {

      this.goToPage(
        this.currentPage - 1
      );

    }
  }


  /* =========================================================
     NEXT
     ========================================================= */

  goNext(): void {

    if (
      this.currentPage < this.totalPages
    ) {

      this.goToPage(
        this.currentPage + 1
      );

    }
  }


  /* =========================================================
     FIRST
     ========================================================= */

  goFirst(): void {

    if (this.currentPage > 1) {
      this.goToPage(1);
    }
  }


  /* =========================================================
     LAST
     ========================================================= */

  goLast(): void {

    if (
      this.currentPage < this.totalPages
    ) {

      this.goToPage(
        this.totalPages
      );

    }
  }


  /* =========================================================
     PAGE SIZE
     ========================================================= */

  onPageSizeChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    const newPageSize =
      Number(select.value);

    if (!newPageSize) {
      return;
    }


    this.pageSize = newPageSize;

    /*
     * Reset to first page when
     * page size changes.
     */
    this.currentPage = 1;


    this.pageSizeChange.emit(
      this.pageSize
    );


    this.pageChange.emit(
      this.currentPage
    );
  }

}