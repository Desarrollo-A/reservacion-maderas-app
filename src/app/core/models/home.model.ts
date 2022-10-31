export class HomeModel {
  cards: InfoCardsModel;
  last7DaysRequests: number[];
  totalMonth: number;
  percentage: number;

  constructor(home) {
    this.cards = home.cards;
    this.last7DaysRequests = home.last7DaysRequests;
    this.totalMonth = home.totalMonth;
    this.percentage = home.percentage;
  }
}

class InfoCardsModel {
  news: number;
  approved: number;
  cancelled: number;
  requests: number;
}
