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
  NgxDatatableModule,
  TableColumn
} from '@swimlane/ngx-datatable';
import { TableRow } from '../../../core/model/table.interface';



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

  @Input() rows: TableRow[] = [];

  @Input() columns: TableColumn[] = [];

  @Input() loading = false;

  @Input() actionTemplate?: TemplateRef<any>;

  @Output() rowClicked = new EventEmitter<TableRow>();

  @Output() pageSizeChanged = new EventEmitter<number>();

  pageSize = 10;

  readonly pageSizeOptions = [
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

    this.table.offset = 0;

    this.pageSizeChanged.emit(
      this.pageSize
    );

  }

}