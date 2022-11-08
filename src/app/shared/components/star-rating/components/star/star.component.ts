import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styles: [`
    .star-icon {
      transform: scale(2);
    }
  `]
})
export class StarComponent {
  @Input()
  starId: number;
  @Input()
  rating: number;

  @Output()
  starEnter: EventEmitter<number> = new EventEmitter();
  @Output()
  starLeave: EventEmitter<void> = new EventEmitter();
  @Output()
  starClicked: EventEmitter<number> = new EventEmitter();

  onStarEnter(): void {
    this.starEnter.emit(this.starId);
  }

  onStarLeave(): void {
    this.starLeave.emit();
  }

  onStarClicked(): void {
    this.starClicked.emit(this.starId);
  }
}
