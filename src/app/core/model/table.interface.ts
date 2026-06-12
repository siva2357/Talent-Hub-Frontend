import { TemplateRef } from '@angular/core';

export interface TableColumn {
  name: string;
  prop: string;
  width?: number;
  sortable?: boolean;
  cellTemplate?: TemplateRef<any>;
}

export interface TableRow {
  [key: string]: any;
}