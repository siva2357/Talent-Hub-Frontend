import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownAction {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  @Input() actions: DropdownAction[] = [];
  @Input() buttonClass: string = 'dropdown-trigger'; 
  @Output() actionSelect = new EventEmitter<string>();

  @ViewChild('menu') menuRef!: ElementRef;
  @ViewChild('trigger') triggerRef!: ElementRef;

  isOpen = false;
  menuTop = 0;
  menuLeft = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.menuRef && this.menuRef.nativeElement) {
      document.body.appendChild(this.menuRef.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.menuRef && this.menuRef.nativeElement && this.menuRef.nativeElement.parentNode === document.body) {
      document.body.removeChild(this.menuRef.nativeElement);
    }
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.isOpen = true;
      const target = (event.currentTarget as HTMLElement);
      const rect = target.getBoundingClientRect();
      
      this.menuTop = rect.bottom + window.scrollY + 8;
      this.menuLeft = rect.right + window.scrollX - 220; 
    }
  }

  closeMenu() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isOpen) return;
    
    const clickedInsideMenu = this.menuRef && this.menuRef.nativeElement ? this.menuRef.nativeElement.contains(event.target) : false;
    const clickedOnTrigger = this.triggerRef && this.triggerRef.nativeElement ? this.triggerRef.nativeElement.contains(event.target) : false;
    
    if (!clickedInsideMenu && !clickedOnTrigger) {
      this.closeMenu();
    }
  }

  onSelect(action: DropdownAction, event: Event) {
    event.stopPropagation();
    if (!action.disabled) {
      this.actionSelect.emit(action.value);
      this.closeMenu();
    }
  }
}
