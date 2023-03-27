import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[decimal]'
})
export class DecimalDirective implements OnInit {
  @Input('decimal')
  decimal: number;

  private regex: RegExp;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const firstPartRegex = /^\d*\.?\d{/;
    const lastPartRegex = /}$/g;

    this.regex = new RegExp(firstPartRegex.source + `1,${(this.decimal - 1)}` + lastPartRegex.source);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      if (event.key == '-') {
        this.el.nativeElement.value = '';
      }
      return;
    }

    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.value.indexOf('.');
    const next: string = [current.slice(0, position), event.key == '.' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
