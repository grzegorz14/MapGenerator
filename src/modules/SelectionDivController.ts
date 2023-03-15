export default class SelectionDivController {
    div: HTMLDivElement;
    initialX: number;
    initialY: number;
    currentX: number;
    currentY: number;

    constructor(div: HTMLDivElement, x: number, y: number) {
        this.show = this.show.bind(this);
        this.move = this.move.bind(this);
        this.setSize = this.setSize.bind(this);

        this.div = div;
        this.initialX = x;
        this.initialY = y;
        this.currentX = x;
        this.currentY = y;

        // assign default styles
        this.div.style.display = "none";
        this.div.style.width = "0";
        this.div.style.height = "0";
    }

    show(value: boolean) {
        this.div.style.display = value ? "block" : "none";
    }

    move(x: number, y: number) {
        this.currentX = x;
        this.currentY = y;
        this.setSize();
    }

    private setSize() {
        let x = this.initialX < this.currentX ? this.initialX : this.currentX;
        let y = this.initialY < this.currentY ? this.initialY : this.currentY;

        let width = Math.abs(this.initialX - this.currentX);
        let height = Math.abs(this.initialY - this.currentY);

        this.div.style.left = x + "px";
        this.div.style.top = y + "px";
        this.div.style.width = width + "px";
        this.div.style.height = height + "px";
    }
}