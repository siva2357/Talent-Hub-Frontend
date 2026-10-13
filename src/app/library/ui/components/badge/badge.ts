import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './badge.html',
  styleUrl: './badge.css'
})
export class Badge {
  @Input() size: 'normal' | 'small' = 'normal';

  @Input() label!: string;

  @Input() variant!: BadgeVariant;

  @Input() appearance!: BadgeStyle;

  @Input() icon!: string;

  @Input() count: number | string | null = null;

  @Input() rounded: boolean = false;
}