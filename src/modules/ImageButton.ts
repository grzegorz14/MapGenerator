import type IButton from "./interfaces/IButton";
import type IClickHandler from "./interfaces/IClickHandler";

// class representing single image button used to draw image on map
export default class ImageButton implements IButton {
    readonly canvas: HTMLCanvasElement;
    clickHandler: IClickHandler;

    constructor(canvas: HTMLCanvasElement, clickHandler: IClickHandler) {
        this.canvas = canvas;
        canvas.classList.add("imageButton");

        this.clickHandler = clickHandler;
        this.canvas.addEventListener("click", () => clickHandler(this));
    }

    draw(imagePart: HTMLCanvasElement) {
        this.canvas.getContext("2d")?.drawImage(imagePart, 0, 0);
    }
}