import CellButton from "./CellButton";
import ImageButton from "./ImageButton";
import type IButton from "./interfaces/IButton";

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
    
    private allowAddingCells: Boolean;
    activeCells: IButton[];

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
        this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this);
        this.handleKeyUpEvents = this.handleKeyUpEvents.bind(this);
        this.deactiveAllCells = this.deactiveAllCells.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleImageButtonClick = this.handleImageButtonClick.bind(this);

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
        this.allowAddingCells = false;
        this.activeCells = [];
    
        // adding methods that handle chosen keyboard events
        const body = document.querySelector("body");
        body?.addEventListener("keydown", this.handleKeyDownEvents);
        body?.addEventListener("keyup", this.handleKeyUpEvents);
    }

    generateImageButtons(): ImageButton[][] {
        const buttons: ImageButton[][] = [];

        const border = this.spriteStartingBorderWidth;
        const iterationWidth = this.cellRepeatWidth + border;

        // first half of the image
        for (let i = border; i < this.image.height; i += iterationWidth) {
            const row: ImageButton[] = [];
            const div = document.createElement("div");
            div.style.height = this.rowHeight + "px";
            this.imageContainer.append(div);
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
                row.push(new ImageButton(canvas, this.handleImageButtonClick));
                div.append(canvas);
            }
            buttons.push(row);
        }
        // second half of the image
        for (let i = border; i < this.image.height; i += iterationWidth) {
            const row: ImageButton[] = [];
            const div = document.createElement("div");
            div.style.height = this.rowHeight + "px";
            this.imageContainer.append(div);
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
                row.push(new ImageButton(canvas, this.handleImageButtonClick));
                div.append(canvas);
            }
            buttons.push(row);
        }
        return buttons;
    }
    
    generateMap(): CellButton[][] {
        const blocks: CellButton[][] = [];
    
        for (let i = 0; i < this.rowsOnMap; i++) {
            const element = document.createElement("div");  
            element.style.height = this.rowHeight + "px";
            const row: CellButton[] = [];
            for (let j = 0; j < this.columnsOnMap; j++) {
                const block = new CellButton(
                    element,
                    this.buttonSize,
                    i,
                    j,
                    this.handleCellClick
                );
                row.push(block);
            }
            blocks.push(row);
            this.map.append(element);
        }
        return blocks;
    }
    
    handleCellClick(cell: IButton) {
        if (!this.allowAddingCells) {
            this.deactiveAllCells();
        } 
        if (!this.activeCells.includes(cell)) {
            this.activeCells.push(cell);
            cell.active = true;
        }
    }
    
    deactiveAllCells() {
        this.activeCells.forEach((element) => {
            element.active = false;
        });
        this.activeCells.length = 0;
    }
    
    handleImageButtonClick(button: ImageButton) {
        this.activeCells.forEach((cell) => {
            cell.draw(button.canvas);
            cell.active = false;
        });
        this.activeCells.length = 0;
    }  

    handleKeyDownEvents(event: KeyboardEvent) {
        if (event.key == "Control") {
            this.allowAddingCells = true;
        }
    }
    handleKeyUpEvents(event: KeyboardEvent) {
        if (event.key == "Control") {
            this.allowAddingCells = false;
        }
    }
}