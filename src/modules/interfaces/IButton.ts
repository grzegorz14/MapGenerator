import type IClickHandler from "./IClickHandler";

export default interface IButton {
    canvas: HTMLCanvasElement;
    active?: boolean;
    clickHandler: IClickHandler;
    draw: (canvas: HTMLCanvasElement) => void;
}