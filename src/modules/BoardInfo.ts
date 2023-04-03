// class that stores information from config file
export default class BoardInfo {
    public cellRepeatWidth: number;
    public spriteStartingBorderWidth: number;
    public buttonSize: number;
    public buttonBorderSize: number;
    public rowHeight: number;
    public columnsOnMap: number;
    public rowsOnMap: number;

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