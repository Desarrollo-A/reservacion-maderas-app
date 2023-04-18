import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMultipleFilesComponent } from './upload-multiple-files.component';
import { FileListComponent } from './file-list/file-list.component';
import { MaterialModule } from "../../../material/material.module";
import { FileListReadonlyComponent } from './file-list-readonly/file-list-readonly.component';
import { UrlModule } from "../../pipes/url/url.module";



@NgModule({
  declarations: [
    UploadMultipleFilesComponent,
    FileListComponent,
    FileListReadonlyComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UrlModule,
  ],
  exports: [
    UploadMultipleFilesComponent,
    FileListReadonlyComponent
  ]
})
export class UploadMultipleFilesModule { }
