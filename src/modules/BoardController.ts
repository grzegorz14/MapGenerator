import CellButton from "./CellButton";
import ImageButton from "./ImageButton";
import type IButton from "./interfaces/IButton";
import type IMapButton from "./interfaces/IMapButton";

export default class BoardController {
    image: HTMLImageElement;
    imageContainer: HTMLDivElement;
    map: HTMLDivElement;
    autoCheckbox: HTMLInputElement;

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
    activeCells: IMapButton[];

    constructor(
        imageId: string,
        imageContainerId: string,
        mapId: string,
        autoCheckboxId: string,
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
        this.drawOnActiveCells = this.drawOnActiveCells.bind(this);
        this.activateNextCell = this.activateNextCell.bind(this);

        // assigning values from config.ts
        this.image = document.getElementById(imageId) as HTMLImageElement;
        this.imageContainer = document.getElementById(imageContainerId) as HTMLDivElement;
        this.map = document.getElementById(mapId) as HTMLDivElement;
        this.autoCheckbox = document.getElementById(autoCheckboxId) as HTMLInputElement;

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
    
        for (let x = 0; x < this.rowsOnMap; x++) { // x - row
            const element = document.createElement("div");  
            element.style.height = this.rowHeight + "px";
            const row: CellButton[] = [];
            for (let y = 0; y < this.columnsOnMap; y++) { // y - column
                const block = new CellButton(
                    element,
                    this.buttonSize,
                    x,
                    y,
                    this.handleCellClick
                );
                row.push(block);
            }
            blocks.push(row);
            this.map.append(element);
        }
        return blocks;
    }
    
    // select cell
    handleCellClick(cell: IMapButton) {
        if (!this.allowAddingCells) {
            this.deactiveAllCells();
        } 
        if (!this.activeCells.includes(cell)) {
            this.activeCells.push(cell);
            cell.active = true;
        }
    }
    
    // draw clicked image on selected cells
    handleImageButtonClick(button: IButton) {
        this.drawOnActiveCells(button.canvas);
        if (this.activeCells.length > 0 && this.autoCheckbox.checked) {
            this.activateNextCell();
        }
        else {
            this.activeCells.length = 0;
        }
    }  

    drawOnActiveCells(canvas: HTMLCanvasElement) {
        this.activeCells.forEach(cell => {
            cell.draw(canvas);
            cell.active = false;
        });
    }

    activateNextCell() {
        let x = this.activeCells[this.activeCells.length - 1].x 
        let y = this.activeCells[this.activeCells.length - 1].y + 1
        if (y >= this.columnsOnMap) {
            x++;
            y = 0;
        }
        if (x >= this.rowsOnMap) {
            x = 0;
            y = 0;
        }
        this.activeCells.length = 0;

        this.cells[x][y].active = true;
        this.activeCells.push(this.cells[x][y]);
    }

    handleKeyDownEvents(event: KeyboardEvent) {
        switch (event.key) {
            case "Control":
                this.allowAddingCells = true;
                break;
            case "Delete":
                this.deactiveAllCells();
                break;
        }
    }
    handleKeyUpEvents(event: KeyboardEvent) {
        if (event.key == "Control") {
            this.allowAddingCells = false;
        }
    }

    deactiveAllCells() {
        this.activeCells.forEach((element) => {
            element.active = false;
        });
        this.activeCells.length = 0;
    }
}