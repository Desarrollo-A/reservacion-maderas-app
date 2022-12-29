import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { RequestPackageService } from '../core/services/request-package.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit, AfterViewInit{

  constructor(private requestPackageService: RequestPackageService) { }

  @ViewChild('canvasRef', {static: false}) canvasRef: any;
  isAvailable: boolean;
  public canvasDownload = null;
  public width = 500;
  public height = 300;
  private context : CanvasRenderingContext2D;
  private points: Array<any> = [];

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = ($event) => {
    if ($event.target.id === 'canvasId' && (this.isAvailable)) {
      this.canvasDownload = $event.target;
      this.write($event);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  touchmove = ($event) => {
    if ($event.target.id === 'canvasId' && (this.isAvailable)) {
      this.canvasDownload = $event.target;
      this.write($event.touches[0]);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown = (e: any) => {
    if(e.target.id === 'canvasId'){
      this.points = [];
      this.isAvailable = true;
    }
  }

  @HostListener('document:touchstart', ['$event'])
  touchstart = (e: any) => {
    if(e.target.id === 'canvasId'){
      this.points = [];
      this.isAvailable = true;
    }
  }

  @HostListener("document:mouseup", ['$event'])
  mouseup = (e: any) =>{
    if(e.target.id === 'canvasId'){
      this.isAvailable = false;
    }
  }

  @HostListener("document:touchend", ['$event'])
  touchend = (e: any) =>{
    if(e.target.id === 'canvasId'){
      this.isAvailable = false;
    }
  }

  //preparacion del lienzo o de los materiales y atributos del pincel y zona a dibujar
  private render (): any{
    const canvasEl = this.canvasRef.nativeElement;
    this.context = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, canvasEl.width, canvasEl.height);
  }

  //Funcion dedicada para la escritura del dibujo dentro del lienzo ya realizado.
  private write(res): any {
    const canvasEl: any = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top
    };
    
    this.writeSingle(prevPos);
  }

  private writeSingle = (prePos) => {
    this.points.push(prePos);
    if (this.points.length > 3) {
      const prevPos = this.points[this.points.length - 1]
      const currentPos = this.points[this.points.length - 2]
      this.drawOnCanvas(currentPos, prevPos);
    }
  }

  private drawOnCanvas(currentPos: any, prevPos: any){
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

  public clearZone() {
    this.points = []
    this.context.clearRect(0, 0, this.width, this.height);
  }

  public download(){
    const link = document.createElement('a');
    link.download = "Signature.png";
    link.href = this.canvasDownload.toDataURL();
    link.click();
  }

  public convertToBlob (){
    this.canvasRef.nativeElement.toBlob((blob: Blob) => {
      const file = new File([blob], "signature.png", {type: "image/png"});
      this.requestPackageService.uploadFileCanvas(file).subscribe();
    }, 'image/png', 1.0);
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.render(); 
  }

}