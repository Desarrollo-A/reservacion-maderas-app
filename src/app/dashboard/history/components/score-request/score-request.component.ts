import { Component, Input } from '@angular/core';
import { ScoreModel } from "../../../../core/models/score.model";

@Component({
  selector: 'app-score-request',
  templateUrl: './score-request.component.html',
  styles: []
})
export class ScoreRequestComponent {
  @Input()
  score: ScoreModel;

  constructor() {}

  get stars(): number[] {
    return [... Array(this.score.score).keys()];
  }

  get comment(): string {
    return (this.score.comment) ? this.score.comment : 'Sin comentarios por parte del solicitante.';
  }
}
