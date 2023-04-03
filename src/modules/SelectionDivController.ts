// class used for drawing rectangle while selecting cells
export default class SelectionDivController {
    readonly div: HTMLDivElement;
    readonly initialX: number;
    readonly initialY: number;
    private currentX: number;
    private currentY: number;

    constructor(div: HTMLDivElement, x: number, y: number) {
        this.show = this.show.bind(this);
        this.move = this.move.bind(this);
        this.setSize = this.setSize.bind(this);
        this.getOffsetX = this.getOffsetX.bind(this);
        this.getOffsetY = this.getOffsetY.bind(this);

        this.div = div;
        this.initialX = this.getOffsetX(x);
        this.initialY = this.getOffsetY(y);
        this.currentX = this.getOffsetX(x);
        this.currentY = this.getOffsetY(y);

        // assign default styles
        this.div.style.display = "none";
        this.div.style.width = "0";
        this.div.style.height = "0";
    }

    show(value: boolean) {
        this.div.style.display = value ? "block" : "none";
    }

    move(x: number, y: number) {
        this.currentX = this.getOffsetX(x);
        this.currentY = this.getOffsetY(y);
        this.setSize();
    }

    private setSize() {
        let x = this.initialX < this.currentX ? this.initialX : this.currentX;
        let y = this.initialY < this.currentY ? this.initialY : this.currentY;

        let width = Math.abs(this.initialX - this.currentX);
        let height = Math.abs(this.initialY - this.currentY);

        this.div.style.left = x + "px";
        this.div.style.top = y + "px";
        this.div.style.width = (width - 1) + "px";
        this.div.style.height = (height - 1) + "px";
    }

    private getOffsetX(x: number) {
        let bodyRect = document.body.getBoundingClientRect();
        return x - bodyRect.left;
    }
    private getOffsetY(y: number) {
        let bodyRect = document.body.getBoundingClientRect();
        return y - bodyRect.top;
    }
}