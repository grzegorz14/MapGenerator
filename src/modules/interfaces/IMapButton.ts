import type IButton from "./IButton";

export default interface IMapButton extends IButton {
    x: number; // row
    y: number; // column
}