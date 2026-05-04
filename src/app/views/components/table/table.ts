import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() page: number = 1;
  @Input() limit: number = 10;
  @Input() selectable: boolean = false;
  @Input() actions: any[] = []; // [{ label: string, icon: string, callback: (row) => void }]

  @Output() selectionChange = new EventEmitter<any[]>();

  selectedRows = new Set<any>();

  get isAllSelected() {
    return this.data.length > 0 && this.selectedRows.size === this.data.length;
  }

  toggleSelectAll() {
    if (this.isAllSelected) {
      this.selectedRows.clear();
    } else {
      this.data.forEach(row => this.selectedRows.add(row));
    }
    this.emitSelection();
  }

  toggleRowSelection(row: any) {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.emitSelection();
  }

  isRowSelected(row: any) {
    return this.selectedRows.has(row);
  }

  private emitSelection() {
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  handleAction(action: any, row: any) {
    if (action.callback) {
      action.callback(row);
    }
  }
}
