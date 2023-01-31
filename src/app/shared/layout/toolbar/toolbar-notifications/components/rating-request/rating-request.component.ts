import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../../utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationModel } from "../../models/notification.model";
import { fadeInUp400ms } from "../../../../../animations/fade-in-up.animation";
import { StarRatingComponent } from "../../../../../components/star-rating/star-rating.component";
import { ScoreModel } from "../../../../../../core/models/score.model";
import { TypeRequestLookup } from "../../../../../../core/enums/lookups/type-request.lookup";

@Component({
  selector: 'app-rating-request',
  templateUrl: './rating-request.component.html',
  styleUrls: ['./rating-request.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class RatingRequestComponent implements OnInit {
  @ViewChild('starRatingComponent')
  public starRatingComponent: StarRatingComponent;

  form: FormGroup;
  formErrors: FormErrors;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<RatingRequestComponent>,
              @Inject(MAT_DIALOG_DATA) public notification: NotificationModel) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      comment: [null, [Validators.minLength(3), Validators.maxLength(2500)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  get service(): string {
    const requestTypeCode = this.notification.requestNotification.request.type.code;

   if (requestTypeCode === TypeRequestLookup[TypeRequestLookup.ROOM]) {
     const room = this.notification.requestNotification.request.requestRoom.room.name;
     return `Sala de junta "${room}"`;
   }

   if (requestTypeCode === TypeRequestLookup[TypeRequestLookup.PARCEL]) {
     return 'Paquetería';
   }

    if (requestTypeCode === TypeRequestLookup[TypeRequestLookup.DRIVER]) {
      return 'Chofer';
    }

    if (requestTypeCode === TypeRequestLookup[TypeRequestLookup.CAR]) {
      return 'Vehículo';
    }

   return '';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { comment } = this.form.getRawValue();
    const score = <ScoreModel>{
      comment,
      score: this.starRatingComponent.rating,
      requestId: this.notification.requestNotification.requestId
    }

    this.dialogRef.close(score);
  }
}
