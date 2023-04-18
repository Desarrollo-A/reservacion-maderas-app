import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-upload-multiple-files',
  templateUrl: './upload-multiple-files.component.html',
  styles: []
})
export class UploadMultipleFilesComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput: ElementRef;

  @Input()
  labelTxt = '';
  @Input()
  hintTxt = '';
  @Input()
  accept = '';
  @Input()
  lengthFiles = 1; // En mb

  files: File[] = [];

  constructor(private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  changeFile(file?: File): void {
    if (!file) {
      return;
    }

    if ((file.size / 1000000) > this.lengthFiles) {
      this.toastrService.warning(`Solo se pueden subir archivos menores a ${this.lengthFiles}mb`, 'Validación');
      this.clearFileInput();
      return;
    }

    this.files.push(file);
    this.clearFileInput();
  }

  deleteFile(i: number): void {
    this.files.splice(i, 1);
  }

  private clearFileInput(): void {
    this.fileInput.nativeElement.value = null;
  }
}
