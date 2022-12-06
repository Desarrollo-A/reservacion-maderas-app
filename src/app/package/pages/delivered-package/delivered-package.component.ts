import { Component } from '@angular/core';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';

@Component({
  selector: 'app-delivered-package',
  templateUrl: './delivered-package.component.html',
  styleUrls: ['./delivered-package.component.scss'],
  animations: [fadeInUp400ms]
})
export class DeliveredPackageComponent {

  constructor() { }

}