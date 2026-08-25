import { Component, Input } from '@angular/core';

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple';

type BadgeStyle =
  | 'solid'
  | 'subtle'
  | 'outline';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.css'
})
export class Badge {

  @Input() label!: string;

  @Input() variant!: BadgeVariant;

  @Input() appearance!: BadgeStyle;

  @Input() icon!: string;

  @Input() count: number | string | null = null;

  @Input() rounded: boolean = false;
}