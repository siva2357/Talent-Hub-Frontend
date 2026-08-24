import { Component, EventEmitter, Input, Output } from '@angular/core';

export type DropdownMode =
  | 'icon'
  | 'text';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css'
})
export class Dropdown {

  @Input() mode: DropdownMode = 'icon';

  @Input() items: DropdownItem[] = [];

  @Output() itemSelected =
    new EventEmitter<DropdownItem>();


  onItemClick(item: DropdownItem): void {

    if (item.disabled) {
      return;
    }

    this.itemSelected.emit(item);
  }

}