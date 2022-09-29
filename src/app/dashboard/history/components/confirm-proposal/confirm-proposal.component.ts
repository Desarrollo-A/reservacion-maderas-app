import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-proposal',
  templateUrl: './confirm-proposal.component.html',
  styles: [
  ]
})
export class ConfirmProposalComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmProposalComponent>,
              @Inject(MAT_DIALOG_DATA) public chooseNumber: number) {}
}
