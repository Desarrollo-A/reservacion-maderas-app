import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { RoomModel } from "../../../../core/models/room.model";
import { RoomService } from "../../../../core/services/room.service";

@Component({
  selector: 'app-room-create-update',
  templateUrl: './room-create-update.component.html',
  styleUrls: ['./room-create-update.component.scss']
})
export class RoomCreateUpdateComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(private dialogRef: MatDialogRef<RoomCreateUpdateComponent>,
              private fb: FormBuilder,
              private roomService: RoomService,
              private toastrService: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data?: RoomModel) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      noPeople: [this.data?.noPeople ?? 0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.data) {
      const room: RoomModel = this.form.getRawValue();
      this.roomService.store(room).subscribe(() => {
        this.toastrService.success('Registro agregado', 'Proceso exitoso');
        this.dialogRef.close(true);
      });
    } else {
      const room: RoomModel = {
        id: this.data.id,
        ... this.form.getRawValue()
      };

      this.roomService.update(this.data.id, room).subscribe(() => {
        this.toastrService.success('Registro actualizado', 'Proceso exitoso');
        this.dialogRef.close(true);
      });
    }
  }
}
