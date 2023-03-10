import CellButton from "./CellButton";
import ImageButton from "./ImageButton";

export default class BoardController {
    image: HTMLImageElement;
    imageContainer: HTMLDivElement;
    map: HTMLDivElement;

    cellRepeatWidth: number;
    spriteStartingBorderWidth: number;
    buttonSize: number;
    buttonBorderSize: number;
    rowHeight: number;
    columnsOnMap: number;
    rowsOnMap: number;

    readonly imageButtons: ImageButton[][];
    readonly cells: CellButton[][];
    
    addingActive: Boolean;
    activeDisplayBlocks: CellButton[];

    constructor(
        imageId: string,
        imageContainerId: string,
        mapId: string,
        cellRepeatWidth: number,
        spriteStartingBorderWidth: number,
        buttonSize: number,
        buttonBorderSize: number,
        columnsOnMap: number,
        rowsOnMap: number
      ) {
        // binding methods
        this.activateAdding = this.activateAdding.bind(this);
        this.deactivateAdding = this.deactivateAdding.bind(this);
        this.clearTab = this.clearTab.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);

        // assigning values from config.ts
        this.image = document.getElementById(imageId) as HTMLImageElement;
        this.imageContainer = document.getElementById(imageContainerId) as HTMLDivElement;
        this.map = document.getElementById(mapId) as HTMLDivElement;

        this.cellRepeatWidth = cellRepeatWidth;
        this.spriteStartingBorderWidth = spriteStartingBorderWidth;
        this.buttonSize = buttonSize;
        this.buttonBorderSize = buttonBorderSize;
        this.rowHeight = buttonSize + 2 * buttonBorderSize;
        this.columnsOnMap = columnsOnMap;
        this.rowsOnMap = rowsOnMap;

        // generating board
        this.imageButtons = this.generateImageButtons();
        this.cells = this.generateMap();
        this.addingActive = false;
        this.activeDisplayBlocks = [];
    
        // adding methods that handle chosen keyboard events
        const body = document.querySelector("body");
        body?.addEventListener("keydown", this.activateAdding);
        body?.addEventListener("keyup", this.deactivateAdding);
    }

    generateImageButtons(): ImageButton[][] {
        const buttons: ImageButton[][] = [];
        const container: HTMLDivElement = this.imageContainer;

        const border = this.spriteStartingBorderWidth;
        const iterationWidth = this.cellRepeatWidth + border;

        // first half of the image
        for (let i = border; i < this.image.height; i += iterationWidth) {
            const row: ImageButton[] = [];
            const div = document.createElement("div");
            div.style.height = this.rowHeight + "px";
            container.append(div);
            for (let j = border; j < this.image.width / 2; j += this.cellRepeatWidth + border) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = this.buttonSize;
                const ctx = canvas.getContext("2d");
                if (ctx != null) {
                    ctx.drawImage(
                        this.image,
                        j,
                        i,
                        this.cellRepeatWidth,
                        this.cellRepeatWidth,
                        0,
                        0,
                        this.buttonSize,
                        this.buttonSize
                    );
                }
                row.push(new ImageButton(canvas, this.handleButtonClick));
                div.append(canvas);
            }
            buttons.push(row);
        }
        // second half of the image
        for (let i = border; i < this.image.height; i += iterationWidth) {
            const row: ImageButton[] = [];
            const div = document.createElement("div");
            div.style.height = this.rowHeight + "px";
            container.append(div);
            for (let j = border + this.image.width / 2; j < this.image.width; j += iterationWidth) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = this.buttonSize;
                const ctx = canvas.getContext("2d");
                if (ctx != null) {
                    ctx.drawImage(
                        this.image,
                        j,
                        i,
                        this.cellRepeatWidth,
                        this.cellRepeatWidth,
                        0,
                        0,
                        this.buttonSize,
                        this.buttonSize
                    );
                }
                row.push(new ImageButton(canvas, this.handleButtonClick));
                div.append(canvas);
            }
            buttons.push(row);
        }
        return buttons;
    }
    
    generateMap(): CellButton[][] {
        const blocks: CellButton[][] = [];
        const parent = this.map;
    
        for (let i = 0; i < this.rowsOnMap; i++) {
            const element = document.createElement("div");  
            element.style.height = this.rowHeight + "px";
            const row: CellButton[] = [];
            for (let j = 0; j < this.columnsOnMap; j++) {
                const block = new CellButton(
                    element,
                    this.buttonSize,
                    this.handleCellClick
                );
                row.push(block);
            }
            blocks.push(row);
            parent.append(element);
        }
        return blocks;
    }
    
    activateAdding(ev: KeyboardEvent) {
        if (ev.key == "Control") {
            this.addingActive = true;
            console.log(this.addingActive);
        }
    }
    deactivateAdding(ev: KeyboardEvent) {
        if (ev.key == "Control") {
            this.addingActive = false;
            console.log(this.addingActive);
        }
    }
    
    handleCellClick(trigger: CellButton) {
        if (!this.addingActive) this.clearTab();
        if (!this.activeDisplayBlocks.includes(trigger)) {
            this.activeDisplayBlocks.push(trigger);
            trigger.active = true;
        }
    }
    
    clearTab() {
        this.activeDisplayBlocks.forEach((element) => {
            element.active = false;
        });
        this.activeDisplayBlocks.length = 0;
    }
    
    handleButtonClick(button: ImageButton) {
        this.activeDisplayBlocks.forEach((element) => {
            element.draw(button.canvas);
            element.active = false;
        });
        this.activeDisplayBlocks.length = 0;
    }  
}