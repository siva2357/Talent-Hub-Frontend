import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-seeker',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './seeker.html',
  styleUrl: './seeker.css',
    standalone: true,
})
export class Seeker {

}
