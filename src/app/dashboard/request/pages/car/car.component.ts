import { Component, OnInit } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class CarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
