import { Component } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  stars = [1, 2, 3, 4, 5];
  rating = 1;
  hoverState = 0;

  onStarEnter(starId: number): void {
    this.hoverState = starId;
  }

  onStarLeave(): void {
    this.hoverState = 0;
  }

  onStarClicked(starId: number): void {
    this.rating = starId;
  }
}
