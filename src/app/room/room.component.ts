import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  room: string;
  constructor(private activateRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.room = this.activateRouter.snapshot.paramMap.get('room');
    console.log(this.room);
  }

}
