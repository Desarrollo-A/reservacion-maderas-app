import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styles: ['']
})
export class DeleteConfirmComponent {

  constructor(public dialogRef: MatDialogRef<DeleteConfirmComponent>) {}

}
