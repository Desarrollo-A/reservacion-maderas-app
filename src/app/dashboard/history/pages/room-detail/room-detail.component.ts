import { Component, OnInit } from '@angular/core';
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class RoomDetailComponent implements OnInit {
  breadcrumbs: Breadcrumbs[] = [
    {link: '/dashboard/historial/sala', label: 'Historial'}
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
