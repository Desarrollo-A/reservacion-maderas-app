import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HeavyShipmentModel } from "../../../../core/models/heavy-shipment.model";

@Component({
  selector: 'app-heavy-shipping-detail',
  templateUrl: './heavy-shipping-detail.component.html',
  styles: [
  ]
})
export class HeavyShippingDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: HeavyShipmentModel) {}
}
