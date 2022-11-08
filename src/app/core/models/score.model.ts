export class ScoreModel {
  id: number;
  requestId: number;
  score: number;
  comment: string;

  constructor(score) {
    this.id = score.id;
    this.requestId = score.requestId;
    this.score = score.score;
    this.comment = score.comment;
  }
}
