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

  showMoreMenu = false;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['menuItems'] && this.menuItems.length) {
      this.menuItemsMain = this.menuItems.slice(0,4);
      this.menuItemsMore = this.menuItems.slice(4);
    }

  }

  toggleMoreMenu(){
    this.showMoreMenu = !this.showMoreMenu;
  }

selectItem(item: SidebarItem) {

  if (this.menuItems.slice(0,3).some(i => i.link === item.link)) {
    this.showMoreMenu = false;
    return;
  }

  this.menuItemsMain = [
    this.menuItems[0],
    this.menuItems[1],
    this.menuItems[2],
    item
  ];

  this.showMoreMenu = false;

}

}
