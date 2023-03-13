export default class CellButton {
    canvas: HTMLCanvasElement;
    private _active: boolean;
    clickHandler: (button: CellButton) => void;
  
    constructor(parent: HTMLElement, width: number, clickHandler: (button: CellButton) => void) {
      this.draw = this.draw.bind(this);
      this.handleClick = this.handleClick.bind(this);

      this.canvas = document.createElement("canvas");
      this._active = false;
      this.active = false;
      this.clickHandler = clickHandler;
  
      this.canvas.width = this.canvas.height = width;
      this.canvas.classList.add("cellButton"); 
      const ctx = this.canvas.getContext("2d");
      ctx?.fillRect(0, 0, width, width);
      ctx?.rect(1, 1, 24, 24);
      parent.append(this.canvas);
  
      this.canvas.addEventListener("click", () => this.clickHandler(this));
    }

    handleClick(event: Event) {
      this.clickHandler(this);
      this.canvas.classList.add("selected");
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