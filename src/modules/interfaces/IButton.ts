export default interface IButton {
    canvas: HTMLCanvasElement;
    active?: boolean;
    draw: (canvas: HTMLCanvasElement) => void;
}