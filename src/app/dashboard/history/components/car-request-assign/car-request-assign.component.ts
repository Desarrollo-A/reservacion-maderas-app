import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { RequestCarModel } from "../../../../core/models/request-car.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { CarModel } from "../../../../core/models/car.model";
import { trackById } from "../../../../shared/utils/track-by";
import { CarService } from "../../../../core/services/car.service";
import { getDateFormat } from "../../../../shared/utils/utils";

@Component({
  selector: 'app-car-request-assign',
  templateUrl: './car-request-assign.component.html',
  styleUrls: ['./car-request-assign.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class CarRequestAssignComponent implements OnInit {
  @Input()
  requestCar: RequestCarModel;

  form: FormGroup;
  formErrors: FormErrors;

  cars: CarModel[] = [];
  trackById = trackById;

  constructor(private fb: FormBuilder,
              private carService: CarService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      carId: [null, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);

    this.loadCars();
  }

  private loadCars(): void {
    const { officeId, request: { startDate, endDate } } = this.requestCar;
    const parseStartDate = getDateFormat(new Date(startDate));
    const parseEndDate = getDateFormat(new Date(endDate));
    this.carService.getAvailableCarsInRequestCar(officeId, parseStartDate, parseEndDate).subscribe(cars => {
      this.cars = cars;
    });
  }
}
