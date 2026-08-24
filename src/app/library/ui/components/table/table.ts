import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';

export interface TableColumn {
  field: string;
  headerName: string;
  cellTemplate?: any;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table<T extends Record<string, any>> {

  @Input() columns: TableColumn[] = [];

  @Input() data: T[] = [];

  public readonly columnModeEnum = ColumnMode;

}
