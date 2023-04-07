import CellButton from "./CellButton";
import ImageButton from "./ImageButton";
import SelectionDivController from "./SelectionDivController";
import type IButton from "./interfaces/IButton";
import type IMapButton from "./interfaces/IMapButton";
import type BoardInfo from "./BoardInfo";

/** 
 * main class 
 */
export default class BoardController {
    readonly image: HTMLImageElement;
    readonly imageContainer: HTMLDivElement;
    readonly map: HTMLDivElement;
    readonly autoCheckbox: HTMLInputElement;
    readonly contextMenu: HTMLDivElement;
    readonly selectionDiv: HTMLDivElement;
    private selectionDivController?: SelectionDivController;

    readonly info: BoardInfo;

    private imageButtons: ImageButton[][];
    public cells: CellButton[][];
    
    private selectionActive: Boolean = false;
    private selectedX: number = -1;
    private selectedY: number = -1;

    private allowAddingCells: Boolean = false;
    private activeCells: CellButton[] = [];

    public cellsHistory: CellButton[][][] = [];
    public currentState: number = 0;

    private isPaste: Boolean = false;
    private isPasteJustTurnedOff: Boolean = false;
    private currentCellX: number = 0;
    private currentCellY: number = 0;
    private copiedCells: Object[][] = [];
    private mapCopy: CellButton[][] = [];

    constructor(boardInfo: BoardInfo) {
        // binding methods
        this.addEvents = this.addEvents.bind(this);
        this.generateImageButtons = this.generateImageButtons.bind(this);
        this.generateMap = this.generateMap.bind(this);
        this.updateCurrentMap = this.updateCurrentMap.bind(this);
        this.createNewMapFromMap = this.createNewMapFromMap.bind(this);
        this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this);
        this.handleKeyUpEvents = this.handleKeyUpEvents.bind(this);
        this.deactiveAllCells = this.deactiveAllCells.bind(this);
        this.handleCellClickDown = this.handleCellClickDown.bind(this);
        this.handleCellClickUp = this.handleCellClickUp.bind(this);
        this.handleMouseOverCell = this.handleMouseOverCell.bind(this);
        this.handleImageButtonClick = this.handleImageButtonClick.bind(this);
        this.activateNextCell = this.activateNextCell.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.isInsideMap = this.isInsideMap.bind(this);
        this.undoHistory = this.undoHistory.bind(this);
        this.redoHistory = this.redoHistory.bind(this);
    
        this.openContextMenu = this.openContextMenu.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.cut = this.cut.bind(this);
        this.copy = this.copy.bind(this);
        this.paste = this.paste.bind(this);
        this.displayExamplePaste = this.displayExamplePaste.bind(this);
        this.delete = this.delete.bind(this);

        // binding html elements by id's
        this.image = document.getElementById("image") as HTMLImageElement;
        this.imageContainer = document.getElementById("imageContainer") as HTMLDivElement;
        this.map = document.getElementById("map") as HTMLDivElement;
        this.selectionDiv = document.getElementById("selection") as HTMLDivElement;
        this.autoCheckbox = document.getElementById("autoCheckbox") as HTMLInputElement;
        this.contextMenu = document.getElementById("contextMenu") as HTMLDivElement;

        // assigning values from config.ts
        this.info = boardInfo;

        // preparing map and events
        this.imageButtons = this.generateImageButtons();
        this.cells = this.generateMap();
        
        this.updateHistory(this.cells);
        this.addEvents();
    }

    /** adds necessary event listeners */
    
    private addEvents() {
        const body = document.querySelector("body");
        body?.addEventListener("keydown", this.handleKeyDownEvents);
        body?.addEventListener("keyup", this.handleKeyUpEvents);
        body?.addEventListener("mousedown", this.handleMouseDown);
        body?.addEventListener("mousemove", this.handleMouseMove);
        body?.addEventListener("mouseup", this.handleMouseUp);
        body?.addEventListener("contextmenu", this.openContextMenu);

        document.getElementById("undoOption")?.addEventListener("click", this.undo);
        document.getElementById("redoOption")?.addEventListener("click", this.redo);
        document.getElementById("cutOption")?.addEventListener("click", this.cut);
        document.getElementById("copyOption")?.addEventListener("click", this.copy);
        document.getElementById("pasteOption")?.addEventListener("click", this.paste);
        document.getElementById("deleteOption")?.addEventListener("click", this.delete);
    }

    /** generates button map named "ITEMS" from image */
    private generateImageButtons(): ImageButton[][] {
        const buttons: ImageButton[][] = [];

        const border = this.info.spriteStartingBorderWidth;
        const iterationWidth = this.info.cellRepeatWidth + border;

        // first half of the image
        for (let i = border; i < this.image.height; i += iterationWidth) {
            const row: ImageButton[] = [];
            const div = document.createElement("div");
            div.style.height = this.info.rowHeight + "px";
            this.imageContainer.append(div);
            for (let j = border; j < this.image.width / 2; j += this.info.cellRepeatWidth + border) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = this.info.buttonSize;
                const ctx = canvas.getContext("2d");
                if (ctx != null) {
                    ctx.drawImage(
                        this.image,
                        j,
                        i,
                        this.info.cellRepeatWidth,
                        this.info.cellRepeatWidth,
                        0,
                        0,
                        this.info.buttonSize,
                        this.info.buttonSize
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
            div.style.height = this.info.rowHeight + "px";
            this.imageContainer.append(div);
            for (let j = border + this.image.width / 2; j < this.image.width; j += iterationWidth) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = this.info.buttonSize;
                const ctx = canvas.getContext("2d");
                if (ctx != null) {
                    ctx.drawImage(
                        this.image,
                        j,
                        i,
                        this.info.cellRepeatWidth,
                        this.info.cellRepeatWidth,
                        0,
                        0,
                        this.info.buttonSize,
                        this.info.buttonSize
                    );
                }
                row.push(new ImageButton(canvas, this.handleImageButtonClick));
                div.append(canvas);
            }
            buttons.push(row);
        }
        return buttons;
    }
    
    /** generates empty map */
    private generateMap(): CellButton[][] {
        const blocks: CellButton[][] = [];
    
        for (let x = 0; x < this.info.rowsOnMap; x++) { // x - row
            const element = document.createElement("div");  
            element.style.height = this.info.rowHeight + "px";
            const row: CellButton[] = [];
            for (let y = 0; y < this.info.columnsOnMap; y++) { // y - column
                const block = new CellButton(
                    element,
                    this.info.buttonSize,
                    x,
                    y,
                    this.handleCellClickDown,
                    this.handleCellClickUp,
                    this.handleMouseOverCell
                );
                row.push(block);
            }
            blocks.push(row);
            this.map.append(element);
        }
        return blocks;
    }

    /**
     * Starts the application with given options
     * @param cells options to start the application with
     * @returns a promise resolved true when the application is ready
     */
    public updateCurrentMap(cells: CellButton[][]): CellButton[][] {
        this.map.innerHTML = "";
        const blocks: CellButton[][] = [];
    
        for (let x = 0; x < this.info.rowsOnMap; x++) { // x - row
            const element = document.createElement("div");  
            element.style.height = this.info.rowHeight + "px";
            const row: CellButton[] = [];
            for (let y = 0; y < this.info.columnsOnMap; y++) { // y - column
                const block = new CellButton(
                    element,
                    this.info.buttonSize,
                    x,
                    y,
                    this.handleCellClickDown,
                    this.handleCellClickUp,
                    this.handleMouseOverCell,
                    cells[x][y].canvas
                );
                row.push(block);
            }
            blocks.push(row);
            this.map.append(element);
        }
        return blocks;
    }

    /** get a copy of map but with new elements */
    public createNewMapFromMap(cells: CellButton[][]): CellButton[][] {
        const blocks: CellButton[][] = [];
    
        for (let x = 0; x < this.info.rowsOnMap; x++) { // x - row
            const element = document.createElement("div");  
            element.style.height = this.info.rowHeight + "px";
            const row: CellButton[] = [];
            for (let y = 0; y < this.info.columnsOnMap; y++) { // y - column
                const block = new CellButton(
                    element,
                    this.info.buttonSize,
                    x,
                    y,
                    this.handleCellClickDown,
                    this.handleCellClickUp,
                    this.handleMouseOverCell,
                    cells[x][y].canvas
                );
                row.push(block);
            }
            blocks.push(row);
        }
        return blocks;
    }

    /** select first cell of selection */
    private handleCellClickDown(cell: IMapButton, event: MouseEvent) {  
        if (event.button == 2) return;
        if (this.isPaste) return;
        if (!this.allowAddingCells) this.deactiveAllCells();
        this.selectedX = cell.x;
        this.selectedY = cell.y;
        cell.canvas.classList.add("startSelection");
    }
    /** acitivate cells in whole selection */
    private handleCellClickUp(cell: IMapButton, event: MouseEvent) {  
        if (event.button == 2) return;
        if (this.isPaste) return;
        if (this.isPasteJustTurnedOff) {
            this.isPasteJustTurnedOff = false;
            return;
        }

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
    /** used for drawing example paste while pasting */
    private handleMouseOverCell(cell: IMapButton, event: MouseEvent) {
        let change = false;
        if (this.currentCellX != cell.x) {
            change = true;
            this.currentCellX = cell.x;
        }
        if (this.currentCellY != cell.y) {
            change = true;
            this.currentCellY = cell.y;
        }
        if(this.isPaste && change) {
            this.displayExamplePaste();
        }
    }
    
    /** draws clicked image on selected cells */
    private handleImageButtonClick(button: IButton) {
        this.activeCells.forEach(cell => {
            cell.draw(button.canvas);
            cell.active = false;
        });
        this.updateHistory(this.cells);
        if (this.activeCells.length > 0 && this.autoCheckbox.checked) this.activateNextCell()
        else this.activeCells.length = 0;
    } 

    /** activates next cell after drawing */
    private activateNextCell() {
        let x = this.activeCells[this.activeCells.length - 1].x 
        let y = this.activeCells[this.activeCells.length - 1].y + 1
        if (y >= this.info.columnsOnMap) {
            x++;
            y = 0;
        }
        if (x >= this.info.rowsOnMap) {
            x = 0;
            y = 0;
        }
        this.activeCells.length = 0;

        this.cells[x][y].active = true;
        this.activeCells.push(this.cells[x][y]);
    }

    /** handles ctrl selection and shortcuts */
    private handleKeyDownEvents(event: KeyboardEvent) {
        let ctrlKey = event.ctrlKey || event.metaKey;

        if (ctrlKey) {
            switch (event.key) {
                case "z":
                    this.undo();
                    break;
                case "y":
                    this.redo();
                    break;
                case "x":
                    this.cut();
                    break;
                case "c":
                    this.copy();
                    break;
                case "v":
                    this.paste();
                    break;
                default:
                    this.allowAddingCells = true;
                    break;
            }
        }
        else if (event.key == "Delete") {
            this.activeCells.forEach(cell => {
                cell.clearCanvas();
            });
            this.deactiveAllCells();
            this.cells = this.updateCurrentMap(this.cells);
            this.updateHistory(this.cells);
        }
    }
    /** stops ctrl selection */
    private handleKeyUpEvents(event: KeyboardEvent) {
        if (event.ctrlKey || event.metaKey) {
            this.allowAddingCells = false;
        }
    }

    /** clears cells selection */
    private deactiveAllCells() {
        this.activeCells.forEach(cell => {
            cell.active = false;
        });
        this.activeCells.length = 0;
    }

    private handleMouseDown(event: MouseEvent) {
        if (event.button == 2) return;
        if (this.contextMenu.classList.contains("visible")) return;

        if (this.isPaste) {
            this.isPaste = false;
            this.isPasteJustTurnedOff = true;
            this.updateHistory(this.cells);
            this.deactiveAllCells();
            return;
        }

        let x = event.clientX;
        let y = event.clientY;

        if (this.isInsideMap(event)) {
            this.selectionDiv.style.display = "block";
            this.selectionDiv.style.left = x + "px";
            this.selectionDiv.style.top = y + "px";

            this.selectionDivController = new SelectionDivController(this.selectionDiv ,x, y);
            this.selectionDivController.show(true);
            this.selectionActive = true;
        }
    }
    private handleMouseMove(event: MouseEvent) {
        if (!this.selectionActive) return;
        if (this.contextMenu.classList.contains("visible")) return;
        if (this.isInsideMap(event)) {
            this.selectionDivController?.move(event.clientX, event.clientY);
        }
    }
    private handleMouseUp(event: MouseEvent) {
        if (event.button == 2) return;
        if (this.contextMenu.classList.contains("visible")) {
            if (event.target != this.contextMenu) {
                this.contextMenu.classList.remove("visible");
            }
            return;
        }
        this.selectionDivController?.show(false);
        this.selectionActive = false;
    }

    /** checks if click is inside map */
    private isInsideMap(event: MouseEvent) { 
        let rect = this.map.getBoundingClientRect();
        return event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom;
    }

    private openContextMenu(event: MouseEvent) {
        event.preventDefault();
        if (this.isInsideMap(event)) {
            this.contextMenu.style.left = event.clientX + "px";
            this.contextMenu.style.top = event.clientY + "px";
            this.contextMenu.classList.add("visible");
        }
    }

    /** saves current map to history */
    public updateHistory(cells: CellButton[][]) {
        let mapCopy: CellButton[][] = this.createNewMapFromMap(cells);
        this.cellsHistory.push(mapCopy);
        this.currentState = (this.cellsHistory.length - 1) > this.currentState ? (this.cellsHistory.length - 1) : this.currentState++;
        console.log("History state: " + this.currentState);
    }

    /** returns last history state */
    private undoHistory(): CellButton[][] {
        if (this.currentState > 0) {
            this.currentState--;
            return this.cellsHistory[this.currentState];
        }
        return this.cellsHistory[0];
    }

    /** returns future history state if undoHistory was called at least once */
    private redoHistory(): CellButton[][] {
        if (this.cellsHistory.length - 1 > this.currentState) {
            this.currentState++;
        }
        return this.cellsHistory[this.currentState];
    }

    /** contextMenu options */

    public undo() {
        let lastMap = this.undoHistory();
        this.cells = this.updateCurrentMap(lastMap);
    }
    public redo() {
        let lastMap = this.redoHistory();
        this.cells = this.updateCurrentMap(lastMap);
    }
    private cut() {
        if (this.activeCells.length == 0) return;
        let topLeftX = this.activeCells.reduce((prev, curr) => prev.x < curr.x ? prev : curr).x;
        let topLeftY = this.activeCells.reduce((prev, curr) => prev.y < curr.y ? prev : curr).y;
        let bottomRightX = this.activeCells.reduce((prev, curr) => prev.x > curr.x ? prev : curr).x;
        let bottomRightY = this.activeCells.reduce((prev, curr) => prev.y > curr.y ? prev : curr).y;

        this.copiedCells = [];

        for (let x = topLeftX; x <= bottomRightX; x++) {
            const row: Object[] = [];
            for (let y = topLeftY; y <= bottomRightY; y++) {
                let emptyObject = new Object();
                row.push(emptyObject);
            }
            this.copiedCells.push(row);
        }

        this.activeCells.forEach(cell => {
            this.copiedCells[cell.x - topLeftX][cell.y - topLeftY] = new CellButton(
                document.createElement("div"),
                this.info.buttonSize,
                cell.x - topLeftX,
                cell.y - topLeftY,
                this.handleCellClickDown,
                this.handleCellClickUp,
                this.handleMouseOverCell,
                cell.canvas
            )
        })

        this.delete();
    }
    private copy() {
        if (this.activeCells.length == 0) return;
        let topLeftX = this.activeCells.reduce((prev, curr) => prev.x < curr.x ? prev : curr).x;
        let topLeftY = this.activeCells.reduce((prev, curr) => prev.y < curr.y ? prev : curr).y;
        let bottomRightX = this.activeCells.reduce((prev, curr) => prev.x > curr.x ? prev : curr).x;
        let bottomRightY = this.activeCells.reduce((prev, curr) => prev.y > curr.y ? prev : curr).y;

        this.copiedCells = [];

        for (let x = topLeftX; x <= bottomRightX; x++) {
            const row: Object[] = [];
            for (let y = topLeftY; y <= bottomRightY; y++) {
                let emptyObject = new Object();
                row.push(emptyObject);
            }
            this.copiedCells.push(row);
        }

        this.activeCells.forEach(cell => {
            this.copiedCells[cell.x - topLeftX][cell.y - topLeftY] = new CellButton(
                document.createElement("div"),
                this.info.buttonSize,
                cell.x - topLeftX,
                cell.y - topLeftY,
                this.handleCellClickDown,
                this.handleCellClickUp,
                this.handleMouseOverCell,
                cell.canvas
            )
        })

        this.deactiveAllCells();
    }
    private paste() {
        this.mapCopy = this.createNewMapFromMap(this.cellsHistory[this.currentState]);
        this.isPaste = true;
    }
    private delete() {
        this.activeCells.forEach(cell => {
            cell.clearCanvas();
        });
        this.deactiveAllCells();
        this.cells = this.updateCurrentMap(this.cells);
        this.updateHistory(this.cells);
    }

    /** draws example paste on map without saving it */
    private displayExamplePaste() {
        this.cells = this.updateCurrentMap(this.mapCopy);

        this.copiedCells.forEach(row => {
            row.forEach(element => {
                if (element instanceof CellButton) {
                    if (this.currentCellX + element.x < this.info.columnsOnMap && this.currentCellY + element.y < this.info.rowsOnMap) {
                        this.cells[this.currentCellX + element.x][this.currentCellY + element.y] = element;
                    }
                }
            });
        });

        this.cells = this.updateCurrentMap(this.cells);
    }
}