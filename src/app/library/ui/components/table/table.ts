import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import {
  ColumnMode,
  NgxDatatableModule
} from '@swimlane/ngx-datatable';
import { Loader } from '../loader/loader';

export interface TableColumn {
  field: string;
  headerName: string;
  cellTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    NgxDatatableModule,
    NgTemplateOutlet,
    Loader
  ],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table<T extends Record<string, any>> {

  @Input() columns: TableColumn[] = [];

  @Input() data: T[] = [];

  @Input() emptyMessage: string = 'No data to display';

  @Input() loading: boolean = false;

  readonly columnModeEnum = ColumnMode;

}