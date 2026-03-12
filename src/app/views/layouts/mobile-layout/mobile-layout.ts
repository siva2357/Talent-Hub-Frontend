import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface SidebarItem {
  label: string;
  icon: string;
  link: string;
  badge?: string;
}

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-layout.html',
  styleUrl: './mobile-layout.css'
})
export class MobileLayout implements OnChanges {

  @Input() menuItems: SidebarItem[] = [];

  menuItemsMain: SidebarItem[] = [];
  menuItemsMore: SidebarItem[] = [];
  defaultMainItems: SidebarItem[] = [];

  showMoreMenu = false;

ngOnChanges(changes: SimpleChanges): void {

  if (changes['menuItems'] && this.menuItems.length) {

    this.defaultMainItems = this.menuItems.slice(0,4);

    this.menuItemsMain = [...this.defaultMainItems];

    this.menuItemsMore = this.menuItems.slice(4);

  }

}

  toggleMoreMenu(){
    this.showMoreMenu = !this.showMoreMenu;
  }

selectItem(item: SidebarItem) {

  const firstItem = this.defaultMainItems[0];

  // if first item clicked → reset
  if (item.link === firstItem.link) {
    this.menuItemsMain = [...this.defaultMainItems];
    this.showMoreMenu = false;
    return;
  }

  // if item from more → replace 4th
  if (!this.menuItemsMain.some(i => i.link === item.link)) {
    this.menuItemsMain = [
      this.defaultMainItems[0],
      this.defaultMainItems[1],
      this.defaultMainItems[2],
      item
    ];
  }

  this.showMoreMenu = false;

}
}
