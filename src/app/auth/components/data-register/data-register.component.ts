import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fadeInUp400ms } from "../../../shared/animations/fade-in-up.animation";

@Component({
  selector: 'app-data-register',
  templateUrl: './data-register.component.html',
  styleUrls: ['./data-register.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class DataRegisterComponent implements OnInit {
  @Output()
  backTo: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
