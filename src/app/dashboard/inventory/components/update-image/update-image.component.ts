import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryModel } from "../../../../core/models/inventory.model";
import { InventoryService } from "../../../../core/services/inventory.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { ToastrService } from "ngx-toastr";
import { SIZE_IMAGE, sizeFile } from "../../../../shared/utils/form-validations";

@Component({
  selector: 'app-update-image',
  templateUrl: './update-image.component.html',
  styleUrls: ['./update-image.component.scss']
})
export class UpdateImageComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  imgTemp: ArrayBuffer|string;

  defaultImage = 'no-image-inventory.png';

  constructor(private dialogRef: MatDialogRef<UpdateImageComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InventoryModel,
              private fb: FormBuilder,
              private inventoryService: InventoryService,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      image: [null, [Validators.required]],
      imageSrc: [null, [sizeFile(SIZE_IMAGE)]]
    });
    this.formErrors = new FormErrors(this.form);
  }

  get canDeleteImage(): boolean {
    return !this.data.image.includes(this.defaultImage);
  }

  changeImage(file: File): void {
    this.form.patchValue({
      imageSrc: file
    });

    if (!file) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {imageSrc} = this.form.getRawValue();
    this.inventoryService.updateImage(this.data.id, imageSrc).subscribe(() => {
      this.toastrService.success('Imagen actualizada', 'Proceso exitoso');
      this.dialogRef.close(true);
    });
  }

  deleteImage(): void {
    this.inventoryService.deleteImage(this.data.id).subscribe(() => {
      this.toastrService.success('Imagen eliminada', 'Proceso exitoso');
      this.dialogRef.close(true);
    });
  }
}
