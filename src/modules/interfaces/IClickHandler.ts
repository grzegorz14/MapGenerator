import type IButton from "./IButton";

export default interface IClickHandler {
    (button: IButton): void;
}