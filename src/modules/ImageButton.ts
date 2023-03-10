export default class ImageButton {
    readonly canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, clickHandler: (button: ImageButton) => void) {
        this.canvas = canvas;
        canvas.classList.add("imageButton");
        this.canvas.addEventListener("click", () => clickHandler(this));
    }
  
    insertIntoPage(parent: HTMLElement) {
        parent.append(this.canvas);
    } 
}