export default class BoardInfo {
    cellRepeatWidth: number;
    spriteStartingBorderWidth: number;
    buttonSize: number;
    buttonBorderSize: number;
    rowHeight: number;
    columnsOnMap: number;
    rowsOnMap: number;

    constructor(
        cellRepeatWidth: number,
        spriteStartingBorderWidth: number,
        buttonSize: number,
        buttonBorderSize: number,
        columnsOnMap: number,
        rowsOnMap: number
      ) {
        this.cellRepeatWidth = cellRepeatWidth;
        this.spriteStartingBorderWidth = spriteStartingBorderWidth;
        this.buttonSize = buttonSize;
        this.buttonBorderSize = buttonBorderSize;
        this.rowHeight = buttonSize + 2 * buttonBorderSize;
        this.columnsOnMap = columnsOnMap;
        this.rowsOnMap = rowsOnMap;
    }
}