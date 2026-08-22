import {
  Component,
  Input
} from '@angular/core';

export interface StatCardData {
  title: string;
  value: string | number;
  icon: string;
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css'
})
export class StatCard {

  @Input({ required: true })
  stat!: StatCardData;

}