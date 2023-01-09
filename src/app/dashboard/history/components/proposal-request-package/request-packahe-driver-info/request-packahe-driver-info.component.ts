import { Component, Input } from '@angular/core';
import { PackageModel } from "../../../../../core/models/package.model";

@Component({
  selector: 'app-request-packahe-driver-info',
  templateUrl: './request-packahe-driver-info.component.html',
  styleUrls: ['./request-packahe-driver-info.component.scss']
})
export class RequestPackaheDriverInfoComponent {
  @Input()
  package: PackageModel;

  constructor() { }

}
