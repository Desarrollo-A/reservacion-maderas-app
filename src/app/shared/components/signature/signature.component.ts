import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements AfterViewInit {
  @ViewChild('canvasRef', {static: false})
  canvasRef: any;

  private context : CanvasRenderingContext2D;
  private points: Array<any> = [];

  isAvailable: boolean;
  canvasDownload = null;
  /*width = 500;
  height = 300;*/

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = ($event) => {
    if ($event.target.id === 'canvas' && (this.isAvailable)) {
      this.canvasDownload = $event.target;
      this.write($event);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  touchmove = ($event) => {
    if ($event.target.id === 'canvas' && (this.isAvailable)) {
      this.canvasDownload = $event.target;
      this.write($event.touches[0]);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown = (e: any) => {
    if(e.target.id === 'canvas'){
      this.points = [];
      this.isAvailable = true;
    }
  }

  @HostListener('document:touchstart', ['$event'])
  touchstart = (e: any) => {
    if(e.target.id === 'canvas'){
      this.points = [];
      this.isAvailable = true;
    }
  }

  @HostListener("document:mouseup", ['$event'])
  mouseup = (e: any) =>{
    if(e.target.id === 'canvas'){
      this.isAvailable = false;
    }
  }

  @HostListener("document:touchend", ['$event'])
  touchend = (e: any) =>{
    if(e.target.id === 'canvas'){
      this.isAvailable = false;
    }
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.render();
  }

  clearZone() {
    this.points = []
    // this.context.clearRect(0, 0, this.width, this.height);
  }

  convertToBlob (){
    this.canvasRef.nativeElement.toBlob((blob: Blob) => {
      // const file = new File([blob], "signature.png", {type: "image/png"});
    }, 'image/png', 1.0);
  }

  //preparacion del lienzo o de los materiales y atributos del pincel y zona a dibujar
  private render(): void {
    const canvasEl = this.canvasRef.nativeElement;
    this.context = canvasEl.getContext('2d');

    /*canvasEl.width = this.width;
    canvasEl.height = this.height;*/


    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, canvasEl.width, canvasEl.height);
  }

  //Funcion dedicada para la escritura del dibujo dentro del lienzo ya realizado.
  private write(res): void {
    const canvasEl: any = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top
    };

    this.writeSingle(prevPos);
  }

  private writeSingle(prePos): void {
    this.points.push(prePos);
    if (this.points.length > 3) {
      const prevPos = this.points[this.points.length - 1]
      const currentPos = this.points[this.points.length - 2]
      this.drawOnCanvas(currentPos, prevPos);
    }
  }

  private drawOnCanvas(currentPos: any, prevPos: any): void {
    if (!this.context) {
      return;
    }

    this.context.beginPath();

    if (prevPos) {
      this.context.moveTo(prevPos.x, prevPos.y);
      this.context.lineTo(currentPos.x, currentPos.y);
      this.context.stroke();
    }
  }
}
