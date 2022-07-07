import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'vex-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Input() customTemplate: TemplateRef<any>;

  year = new Date().getFullYear();

  constructor() {}
}
