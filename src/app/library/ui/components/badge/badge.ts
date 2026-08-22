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

  @Input() label: string = 'badge';

  @Input() variant: BadgeVariant = 'primary';

  @Input() style: BadgeStyle = 'solid';

  @Input() icon: string = '';

  @Input() count: number | string | null = null;

  @Input() rounded: boolean = false;
}