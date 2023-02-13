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

  signaturePoints: Array<any> = [];
  pointsNumber = 1;

  isSigning: boolean = false;
  width: number;
  height: number;
  isAvailable: boolean;
  canvasDownload = null;

  @HostListener('document:click', ['$event'])
  OnClick = (event) => {
    
    if(event.target.id === 'canvas'){
      console.log(event);
      
    }else{
    }
    // if(event.target.id === 'canvas'){
    //   console.log(this.canvasRef.nativeElement.getBoundingClientRect());
    //   console.log(event);
    // }
  }

  @HostListener('window:resize', ['$event'])
  OnRezise = () => {
    this.setCanvasSize();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: MouseEvent) => {
    if (e.target['id'] === 'canvas' && (this.isAvailable) && (this.isSigning)) {
      let position = {
        x: e.offsetX,
        y: e.offsetY
      };
      this.signaturePoints.push(position);
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
      this.pointsNumber = this.pointsNumber + 1;
    }
  }

  @HostListener('document:touchstart', ['$event'])
  touchstart = (e: TouchEvent) => {
    if(e.target['id'] === 'canvas'){
      this.points = [];
      this.isAvailable = true;
      this.pointsNumber = this.pointsNumber + 1;
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
    this.width = Number((getComputedStyle(this.canvasRef.nativeElement).width).split("px")[0]);
    this.height = Number((getComputedStyle(this.canvasRef.nativeElement).height).split("px")[0]);
  }

  clearZone(): void {
    this.points = [];
    this.signaturePoints = [];
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

  changeSize(){
    const canvasEl = this.canvasRef.nativeElement;
    let pointPreX = 0;
    let pointPreY = 0;
    let pointPosX = 0;
    let pointPosY = 0;
    let escaleX = 0;
    let escaleY = 0;
    
    let contextDowload = canvasEl.getContext('2d');
    this.context.clearRect(0, 0, Number((getComputedStyle(this.canvasRef.nativeElement).width)), Number((getComputedStyle(this.canvasRef.nativeElement).height)));
    contextDowload.lineWidth = 2;
    contextDowload.lineCap = 'round';
    contextDowload.fillStyle = "white";
    contextDowload.fillRect(0, 0, canvasEl.width, canvasEl.height);
    contextDowload.beginPath();
    // console.log(this.signaturePoints);
    // console.log(differenceX);
    // console.log(differenceY);
    for (let index = 0; index < this.signaturePoints.length-1; index++) {

      if(this.width === Number((getComputedStyle(this.canvasRef.nativeElement).width).split("px")[0])){
        pointPreX = this.signaturePoints[index].x;
        pointPosX = this.signaturePoints[index+1].x;
      }
      else if (this.width < Number((getComputedStyle(this.canvasRef.nativeElement).width).split("px")[0])) {
        escaleX = Number((getComputedStyle(this.canvasRef.nativeElement).width).split("px")[0]) / this.width;      
        pointPreX = this.signaturePoints[index].x * escaleX;
        pointPosX = this.signaturePoints[index+1].x * escaleX;
      }else if(this.width > Number((getComputedStyle(this.canvasRef.nativeElement).width).split("px")[0])){
        escaleX = this.width / Number((getComputedStyle(this.canvasRef.nativeElement).width).split("px")[0]);
        pointPreX = this.signaturePoints[index].x / escaleX;
        pointPosX = this.signaturePoints[index+1].x / escaleX;
      }

      if(this.height === Number((getComputedStyle(this.canvasRef.nativeElement).height).split("px")[0])){
        pointPreY = this.signaturePoints[index].y;
        pointPosY = this.signaturePoints[index+1].y;
      }
      else if (this.height < Number((getComputedStyle(this.canvasRef.nativeElement).height).split("px")[0])) {
        escaleY = Number((getComputedStyle(this.canvasRef.nativeElement).height).split("px")[0]) / this.width;      
        pointPreY = this.signaturePoints[index].y * escaleY;
        pointPosY = this.signaturePoints[index+1].y * escaleY;
      }else if(this.height > Number((getComputedStyle(this.canvasRef.nativeElement).height).split("px")[0])){
        escaleY = this.height / Number((getComputedStyle(this.canvasRef.nativeElement).height).split("px")[0]);
        pointPreY = this.signaturePoints[index].y / escaleY;
        pointPosY = this.signaturePoints[index+1].y / escaleY;
      }
      // if(differenceX < 0){
      //   pointPreX = this.signaturePoints[index].x + differenceX;
      //   pointPosX = this.signaturePoints[index-1].x + differenceX;
      // }else{
      //   pointPreX = this.signaturePoints[index].x - differenceX;
      //   pointPosX = this.signaturePoints[index-1].x - differenceX;
      // }
      // if (differenceY < 0) {
      //   pointPreY = this.signaturePoints[index].y - differenceY;
      //   pointPosY = this.signaturePoints[index-1].y - differenceY;
      // }else{
      //   pointPreY = this.signaturePoints[index].y + differenceY;
      //   pointPosY = this.signaturePoints[index-1].y + differenceY;
      // }
      // console.log(pointPreX, '<->', pointPosX);
      // console.log(pointPreY, '<->', pointPosY);
      // pointPreX = this.signaturePoints[index].x;
      // pointPosX = this.signaturePoints[index-1].x;
      // pointPreY = this.signaturePoints[index].y;
      // pointPosY = this.signaturePoints[index-1].y;
      
      contextDowload.moveTo(pointPosX, pointPosY);
      contextDowload.lineTo(pointPreX, pointPreY );
      contextDowload.stroke();
    }
    // this.signaturePoints.reverse()
    //   .forEach(function(item, key, arr){
    //     if(key < arr.length-1){
    //       contextDowload.moveTo(arr[key].x, arr[key].y );
    //       contextDowload.lineTo(arr[key+1].x, arr[key+1].y);
    //       contextDowload.stroke();
    //     }
    // });
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
        ? canvasEl.height = this.height - 8
        : canvasEl.height = canvasEl.width * 0.4;
    }else{
      isResponsive
        ? canvasEl.height = this.height - 8
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
    
    canvasEl.width = (canvasParentSize.width) / 2;
    canvasEl.height = canvasEl.width * 0.5;

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
    this.signaturePoints.push(prePos);
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
