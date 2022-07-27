import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RoomModel } from "../../model/room-model";
import { LookupService } from "../../../../core/services/lookup.service";
import { Lookup } from "../../../../core/interfaces/lookup";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { RoomService } from "../../services/room.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-change-status-room',
  templateUrl: './change-status-room.component.html',
  styleUrls: ['./change-status-room.component.scss'],
})
export class ChangeStatusRoomComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  status: Lookup[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public room: RoomModel,
              private dialogRef: MatDialogRef<ChangeStatusRoomComponent>,
              private lookupService: LookupService,
              private fb: FormBuilder,
              private roomService: RoomService,
              private toastrService: ToastrService) {}

  ngOnInit() {
    this.loadStatus();

    this.form = this.fb.group({
      statusId: [this.room.statusId, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);
  }

  loadStatus(): void {
    this.lookupService.findAllByType(TypeLookup.STATUS_ROOM).subscribe(lookups => {
      this.status = lookups;
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { statusId } = this.form.getRawValue();
    this.roomService.changeStatus(this.room.id, statusId).subscribe(() => {
      this.toastrService.success('Registro actualizado', 'Proceso exitoso');
      this.dialogRef.close(true);
    });
  }
}
