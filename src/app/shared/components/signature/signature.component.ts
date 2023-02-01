import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements AfterViewInit {
  @ViewChild('canvasRef', {static: false})
  canvasRef: ElementRef;

  private context : CanvasRenderingContext2D;
  private points: Array<any> = [];

  isSigning: boolean = false;
  width: number;
  height: number;
  isAvailable: boolean;
  canvasDownload = null;

  @HostListener('window:resize', ['$event'])
  OnRezise = () => {
    this.setCanvasSize();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: MouseEvent) => {
    if (e.target['id'] === 'canvas' && (this.isAvailable) && (this.isSigning)) {
      this.canvasDownload = e.target;
      this.write(e);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  touchmove = (e: TouchEvent) => {
    if (e.target['id'] === 'canvas' && (this.isAvailable) && (this.isSigning)) {
      this.canvasDownload = e.target;
      this.write(e.touches[0]);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown = (e: MouseEvent) => {
    if(e.target['id'] === 'canvas'){
      this.points = [];
      this.isAvailable = true;
    }
  }

  @HostListener('document:touchstart', ['$event'])
  touchstart = (e: TouchEvent) => {
    if(e.target['id'] === 'canvas'){
      this.points = [];
      this.isAvailable = true;
    }
  }

  @HostListener("document:mouseup", ['$event'])
  mouseup = (e: MouseEvent) => {
    if(e.target['id'] === 'canvas'){
      this.isAvailable = false;
    }
  }

  @HostListener("document:touchend", ['$event'])
  touchend = (e: TouchEvent) =>{
    if(e.target['id'] === 'canvas'){
      this.isAvailable = false;
    }
  }

  constructor(private layaoutService: LayoutService) { }

  ngAfterViewInit(): void {
    this.render();
    this.canvasRef.nativeElement.classList.contains('disable');
    const canvasParentSize = this.canvasRef.nativeElement.parentElement.getBoundingClientRect();
    const canvasSize = this.canvasRef.nativeElement.getBoundingClientRect();
    if(canvasParentSize.width !== canvasSize.width + 32){
      this.renderResize(false)
    }
  }

  clearZone(): void {
    this.points = []
    const canvasSize = this.canvasRef.nativeElement.getBoundingClientRect();
    this.context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  signatureZone(){
    this.layaoutService.disableScrollBarOnSideNavContent();
    this.isSigning = true;
  }

  isOk(){
    this.layaoutService.enableScrollBarOnSideNavContent();
    this.isSigning = false;
  }

  private setCanvasSize(){
    const canvasParentSize = this.canvasRef.nativeElement.parentElement.getBoundingClientRect();
    const canvasSize = this.canvasRef.nativeElement.getBoundingClientRect();
    if(canvasParentSize.width !== canvasSize.width + 32){
      this.renderResize(false)
    }else{
      this.renderResize(true);
    }
  }

  private renderResize(isResponsive: boolean): void{
    const canvasEl = this.canvasRef.nativeElement;
    let canvasParentSize = this.canvasRef.nativeElement.parentElement.parentElement.getBoundingClientRect();
    isResponsive
      ? canvasEl.width = (canvasParentSize.width) / 2
      : canvasEl.width = (canvasParentSize.width - 32);
    if(window.innerWidth < window.innerHeight){
      isResponsive
        ? canvasEl.height = this.height
        : canvasEl.height = canvasEl.width * 0.4;
    }else{
      isResponsive
        ? canvasEl.height = this.height
        : canvasEl.height = window.innerHeight * 0.5;
    }
    this.context = canvasEl.getContext('2d');
    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, canvasEl.width, canvasEl.height);
  }

  //preparacion del lienzo o de los materiales y atributos del pincel y zona a dibujar
  private render(): void {
    const canvasEl = this.canvasRef.nativeElement;
    let canvasParentSize = this.canvasRef.nativeElement.parentElement.parentElement.getBoundingClientRect();
    this.context = canvasEl.getContext('2d');

    this.height = canvasParentSize.height;
    this.width = canvasParentSize.width;

    canvasEl.width = (canvasParentSize.width) / 2;
    canvasEl.height = canvasParentSize.height;

    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, canvasEl.width, canvasEl.height);
  }

  //Funcion dedicada para la escritura del dibujo dentro del lienzo ya realizado.
  private write(res): void {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top
    };
    this.writeSingle(prevPos);
  }

  private writeSingle(prePos): void {
    this.points.push(prePos);
    if (this.points.length > 1) {
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
