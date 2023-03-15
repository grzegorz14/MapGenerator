import CellButton from "./CellButton";
import ImageButton from "./ImageButton";
import type IButton from "./interfaces/IButton";
import type IMapButton from "./interfaces/IMapButton";
import SelectionDivInfo from "./SelectionDivController";
import SelectionDivController from "./SelectionDivController";

export default class BoardController {
    image: HTMLImageElement;
    imageContainer: HTMLDivElement;
    map: HTMLDivElement;
    selectionDiv: HTMLDivElement;
    selectionDivController?: SelectionDivController;
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
    
    private selectionActive: Boolean = false;
    selectedX: number = -1;
    selectedY: number = -1;

    private allowAddingCells: Boolean = false;
    activeCells: IMapButton[] = [];

    constructor(
        imageId: string,
        imageContainerId: string,
        mapId: string,
        selectionDivId: string,
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
        this.handleCellClickDown = this.handleCellClickDown.bind(this);
        this.handleCellClickUp = this.handleCellClickUp.bind(this);
        this.handleImageButtonClick = this.handleImageButtonClick.bind(this);
        this.drawOnActiveCells = this.drawOnActiveCells.bind(this);
        this.activateNextCell = this.activateNextCell.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        // assigning values from config.ts
        this.image = document.getElementById(imageId) as HTMLImageElement;
        this.imageContainer = document.getElementById(imageContainerId) as HTMLDivElement;
        this.map = document.getElementById(mapId) as HTMLDivElement;
        this.selectionDiv = document.getElementById(selectionDivId) as HTMLDivElement;
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
    
        // adding methods that handle chosen keyboard events and mouse events
        const body = document.querySelector("body");
        body?.addEventListener("keydown", this.handleKeyDownEvents);
        body?.addEventListener("keyup", this.handleKeyUpEvents);
        body?.addEventListener("mousedown", this.handleMouseDown);
        body?.addEventListener("mousemove", this.handleMouseMove);
        body?.addEventListener("mouseup", this.handleMouseUp);
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
                    this.handleCellClickDown,
                    this.handleCellClickUp
                );
                row.push(block);
            }
            blocks.push(row);
            this.map.append(element);
        }
        return blocks;
    }
    
    handleCellClickDown(cell: IMapButton) {  // select first cell of selection
        if (!this.allowAddingCells) {
            this.deactiveAllCells();
        } 
        this.selectedX = cell.x;
        this.selectedY = cell.y;
        cell.canvas.classList.add("startSelection");
    }
    handleCellClickUp(cell: IMapButton) {  // acitivate cells in whole selection
        let startingX = this.selectedX < cell.x ? this.selectedX : cell.x;
        let startingY = this.selectedY < cell.y ? this.selectedY : cell.y;
        let endingX = this.selectedX >= cell.x ? this.selectedX : cell.x;
        let endingY = this.selectedY >= cell.y ? this.selectedY : cell.y;

        for (let row = startingX; row <= endingX; row++) {
            for (let col = startingY; col <= endingY; col++) {
                let cell = this.cells[row][col];
                if (!this.activeCells.includes(cell)) {
                    cell.active = true;
                    this.activeCells.push(cell);
                    cell.canvas.classList.remove("startSelection");
                }
            }
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
            case "Meta":
                this.allowAddingCells = true;
                break;
            case "Delete":
                this.activeCells.forEach(cell => {
                    cell.clearCanvas();
                });
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
        this.activeCells.forEach(cell => {
            cell.active = false;
        });
        this.activeCells.length = 0;
    }

    handleMouseDown(event: MouseEvent) {
        let x = event.clientX;
        let y = event.clientY;

        // check if click is inside map
        let rect = this.map.getBoundingClientRect();
        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
            this.selectionDiv.style.display = "block";
            this.selectionDiv.style.left = x + "px";
            this.selectionDiv.style.top = y + "px";

            this.selectionDivController = new SelectionDivController(this.selectionDiv ,x, y);
            this.selectionDivController.show(true);
            this.selectionActive = true;
        }
    }
    handleMouseMove(event: MouseEvent) {
        if (!this.selectionActive) return;
        let x = event.clientX;
        let y = event.clientY;
        let rect = this.map.getBoundingClientRect();
        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
            this.selectionDivController?.move(x, y);
        }
    }
    handleMouseUp(event: MouseEvent) {
        this.selectionDivController?.show(false);
        this.selectionActive = false;
    }
}