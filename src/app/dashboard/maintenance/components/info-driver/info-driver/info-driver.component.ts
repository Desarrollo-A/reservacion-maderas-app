import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriverModel } from 'src/app/core/models/driver.model';

@Component({
  selector: 'app-info-driver',
  templateUrl: './info-driver.component.html',
  styleUrls: ['./info-driver.component.scss']
})
export class InfoDriverComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public driver: DriverModel) {}

  ngOnInit(): void {
  }

}
