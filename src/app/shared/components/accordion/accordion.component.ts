import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
  id: string | number;
  title: string;
  [key: string]: any;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() accordionId: string = 'appAccordion';
  
  @ContentChild('bodyTemplate', { static: false }) bodyTemplate!: TemplateRef<any>;
}
