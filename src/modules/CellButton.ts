import type IMapButton from "./interfaces/IMapButton";

export default class CellButton implements IMapButton {
    canvas: HTMLCanvasElement;
    width: number;
    private _active: boolean;
    x: number;
    y: number;
    clickDownHandler: (button: IMapButton, event: MouseEvent) => void;
    clickUpHandler: (button: IMapButton, event: MouseEvent) => void;
    mouseOverHandler: (button: IMapButton, event: MouseEvent) => void;
  
    constructor(
      parent: HTMLElement,
      width: number, 
      x: number, 
      y: number, 
      clickDownHandler: (button: IMapButton, event: MouseEvent) => void, 
      clickUpHandler: (button: IMapButton, event: MouseEvent) => void,
      mouseOverHandler: (button: IMapButton, event: MouseEvent) => void,
      canvas?: HTMLCanvasElement,
      ) {
      this.draw = this.draw.bind(this);
      this.clearCanvas = this.clearCanvas.bind(this);

      this.width = width;
      this._active = false;
      this.x = x;
      this.y = y;
      this.clickDownHandler = clickDownHandler;
      this.clickUpHandler = clickUpHandler;
      this.mouseOverHandler = mouseOverHandler;
  
      this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas.height = width;
        this.canvas.classList.add("cellButton"); 
        const ctx = this.canvas.getContext("2d");
      if (canvas == null) {      
        ctx?.fillRect(0, 0, width, width);
        ctx?.rect(1, 1, 24, 24);
      }
      else {
        ctx?.drawImage(canvas, 0, 0, width, width);
      }

      parent.append(this.canvas);
  
      this.canvas.addEventListener("mousedown", (event) => this.clickDownHandler(this, event));
      this.canvas.addEventListener("mouseup", (event) => this.clickUpHandler(this, event));
      this.canvas.addEventListener("mouseover", (event) => this.mouseOverHandler(this, event));
    }

    draw(imagePart: HTMLCanvasElement) {
      this.canvas.getContext("2d")?.drawImage(imagePart, 0, 0);
    }
    
    clearCanvas() {
      const ctx = this.canvas.getContext("2d");
      ctx?.fillRect(0, 0,this.width, this.width);
    }
  
    public set active(value: boolean) {
      this._active = value;
      if (value) this.canvas.classList.add("selected");
      else this.canvas.classList.remove("selected");
    }
    public get active() {
      return this._active;
    }
}