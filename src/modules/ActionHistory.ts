import type CellButton from "./CellButton";

export default class ActionHistory {
    cellsHistory: CellButton[][][] = [];
    currentState: number = 0;

    constructor(cells: CellButton[][]) {
        this.updateHistory = this.updateHistory.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);

        this.cellsHistory.push(cells);
    }

    updateHistory(cells: CellButton[][]) {
        this.cellsHistory.push(cells);
        this.currentState = (this.cellsHistory.length - 1) > this.currentState ? (this.cellsHistory.length - 1) : this.currentState++;
        console.log("History state: " + this.currentState);
    }

    undo(): CellButton[][] {
        if (this.currentState > 0) {
            this.currentState--;
            return this.cellsHistory[this.currentState];
        }
        return this.cellsHistory[0];
    }

    redo(): CellButton[][] {
        if (this.cellsHistory.length - 1 > this.currentState) {
            this.currentState++;
        }
        return this.cellsHistory[this.currentState];
    }
}