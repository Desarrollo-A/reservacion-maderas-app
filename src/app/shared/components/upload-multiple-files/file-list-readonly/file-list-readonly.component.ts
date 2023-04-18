import { Component, Input } from '@angular/core';
import { FileModel } from "../../../../core/models/file.model";

@Component({
  selector: 'app-file-list-readonly',
  templateUrl: './file-list-readonly.component.html',
  styles: [
  ]
})
export class FileListReadonlyComponent {
  @Input()
  files: FileModel[];

  constructor() { }

  filename(file: FileModel): string {
    const parts = file.filename.split('/');
    return parts[parts.length - 1];
  }
}
