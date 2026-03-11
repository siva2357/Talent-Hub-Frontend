import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface SidebarItem {
  label: string;
  icon: string;
  link: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.css',
})
export class SidebarLayout {

  @Input() menuItems: SidebarItem[] = [];

}
