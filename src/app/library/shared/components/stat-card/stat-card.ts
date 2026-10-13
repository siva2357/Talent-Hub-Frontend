import {
  Component,
  Input
} from '@angular/core';
import { StatCardData } from '../../../../core/models/ui.model';
export type {  StatCardData  };

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