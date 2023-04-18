import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styles: [
  ]
})
export class FileListComponent {
  @Input()
  set files(files: File[]) {
    this._files = files;
  }

  @Output()
  deleteFile: EventEmitter<number> = new EventEmitter<number>();

  private _files: File[] = [];

  constructor() { }

  get files(): File[] {
    return this._files;
  }

  delete(i: number): void {
    this.deleteFile.emit(i);
  }
}
