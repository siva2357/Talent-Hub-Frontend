import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DropdownItem, DropdownMode } from '../../../../core/models/ui.model';
export type {  DropdownItem, DropdownMode  };

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