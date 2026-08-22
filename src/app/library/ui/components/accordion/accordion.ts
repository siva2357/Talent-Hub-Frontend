import { Component, Input } from '@angular/core';

export interface AccordionItem {
  title: string;
  content: string;
  icon?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.html',
  styleUrl: './accordion.css'
})
export class Accordion {

  @Input() items: AccordionItem[] = [];

  @Input() multiple: boolean = false;

  toggle(index: number): void {
    const item = this.items[index];

    if (!this.multiple) {
      this.items.forEach((accordionItem, itemIndex) => {
        accordionItem.expanded = itemIndex === index
          ? !item.expanded
          : false;
      });

      return;
    }

    item.expanded = !item.expanded;
  }
}