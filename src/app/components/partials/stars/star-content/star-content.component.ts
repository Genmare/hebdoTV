import { Component, computed, input } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { StarState } from 'app/models/StarState';

@Component({
  selector: 'star-content',
  imports: [StarRatingComponent],
  templateUrl: './star-content.component.html',
  styleUrl: './star-content.component.scss',
})
export class StarContentComponent {
  isTelerama = input(false);
  number = input(0);
  array = computed(() => [...Array(this.number()).keys()].map((n) => n + 1));

  getStarImage(current: number): StarState {
    const previousHalf = current - 0.5;
    let state = new StarState();

    this.number() >= current
      ? (state.isFull = true)
      : this.number() >= previousHalf
        ? (state.isHalf = true)
        : (state.isEmpty = true);

    return state;
  }
}
