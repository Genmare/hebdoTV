import { Component, input } from '@angular/core';
import { StarState } from 'app/models/StarState';

@Component({
  selector: 'star-rating',
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  isTelerama = input(false);
  state = input(new StarState());
}
