import type IButton from "./interfaces/IButton";
import type IClickHandler from "./interfaces/IClickHandler";
import type IMapButton from "./interfaces/IMapButton";

export default class CellButton implements IMapButton {
    canvas: HTMLCanvasElement;
    private _active: boolean;
    x: number;
    y: number;
    clickHandler: IClickHandler;
  
    constructor(parent: HTMLElement, width: number, x: number, y: number, clickHandler: IClickHandler) {
      this.draw = this.draw.bind(this);

      this.canvas = document.createElement("canvas");
      this._active = false;
      this.x = x;
      this.y = y;
      this.clickHandler = clickHandler;
  
      this.canvas.width = this.canvas.height = width;
      this.canvas.classList.add("cellButton"); 
      const ctx = this.canvas.getContext("2d");
      ctx?.fillRect(0, 0, width, width);
      ctx?.rect(1, 1, 24, 24);
      parent.append(this.canvas);
  
      this.canvas.addEventListener("click", () => this.clickHandler(this));
    }

    draw(imagePart: HTMLCanvasElement) {
      this.canvas.getContext("2d")?.drawImage(imagePart, 0, 0);
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