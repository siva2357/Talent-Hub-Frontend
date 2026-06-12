import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  DatatableComponent,
  NgxDatatableModule
} from '@swimlane/ngx-datatable';

export interface TableColumn {
  name: string;
  prop: string;
  width?: number;
  cellTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class Table {

  @ViewChild('table')
  table!: DatatableComponent;

  @Input() rows: Record<string, any>[] = [];

  @Input() columns: TableColumn[] = [];

  @Input() loading = false;

  @Output() rowClicked = new EventEmitter<any>();

  @Output() pageSizeChanged = new EventEmitter<number>();

  pageSize = 5;

  pageSizeOptions = [
    5,
    10,
    25,
    50,
    100
  ];

  onActivate(event: any): void {

    if (
      event.type === 'click' &&
      event.row
    ) {
      this.rowClicked.emit(event.row);
    }

  }

  onPageSizeChange(): void {

    if (this.table) {
      this.table.offset = 0;
    }

    this.pageSizeChanged.emit(this.pageSize);

  }

}