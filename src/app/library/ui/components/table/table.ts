import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import {
  ColumnMode,
  NgxDatatableModule
} from '@swimlane/ngx-datatable';

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
    NgxDatatableModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table<T extends Record<string, any>> {

  @Input() columns: TableColumn[] = [];

  @Input() data: T[] = [];

  readonly columnModeEnum = ColumnMode;

}