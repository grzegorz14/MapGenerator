import type IMapButton from "./interfaces/IMapButton";

export default class CellButton implements IMapButton {
    canvas: HTMLCanvasElement;
    width: number;
    private _active: boolean;
    x: number;
    y: number;
    clickDownHandler: (button: IMapButton) => void;
    clickUpHandler: (button: IMapButton) => void;
  
    constructor(parent: HTMLElement, width: number, x: number, y: number, clickDownHandler: (button: IMapButton) => void, clickUpHandler: (button: IMapButton) => void) {
      this.draw = this.draw.bind(this);
      this.clearCanvas = this.clearCanvas.bind(this);

      this.canvas = document.createElement("canvas");
      this.width = width;
      this._active = false;
      this.x = x;
      this.y = y;
      this.clickDownHandler = clickDownHandler;
      this.clickUpHandler = clickUpHandler;
  
      this.canvas.width = this.canvas.height = width;
      this.canvas.classList.add("cellButton"); 
      const ctx = this.canvas.getContext("2d");
      ctx?.fillRect(0, 0, width, width);
      ctx?.rect(1, 1, 24, 24);
      parent.append(this.canvas);
  
      this.canvas.addEventListener("mousedown", () => this.clickDownHandler(this));
      this.canvas.addEventListener("mouseup", () => this.clickUpHandler(this));
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