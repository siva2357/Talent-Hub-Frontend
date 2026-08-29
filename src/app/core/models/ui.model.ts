import { TemplateRef } from '@angular/core';

export type DropdownMode = 'icon' | 'text';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  className?: string;
}

export interface TableColumn {
  field: string;
  headerName: string;
  cellTemplate?: TemplateRef<any>;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flexGrow?: number;
}

export type PaginationVariant = 'default' | 'text' | 'minimal';
export type PaginationSize = 'sm' | 'md' | 'lg';
export interface PaginationPage {
  number: number;
  disabled?: boolean;
  ellipsis?: boolean;
}

export type InputFieldType = 'text' | 'email' | 'password' | 'date' | 'time' | 'tel' | 'textarea' | 'select' | 'multiselect';
export type InputValidation = 'none' | 'success' | 'error';
export interface InputOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface AccordionItem {
  title: string;
  content: string;
  icon?: string;
  expanded?: boolean;
}

export type TimelineMode = 'default' | 'with-icon' | 'minimal' | 'numbered';
export type TimelineStatus = 'completed' | 'active' | 'upcoming' | 'disabled' | 'error' | 'skipped';
export interface TimelineStep {
  title: string;
  description?: string;
  status: TimelineStatus;
  icon?: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon: string;
}

export interface ChatMessage {
  text: string;
  isBot: boolean;
}
