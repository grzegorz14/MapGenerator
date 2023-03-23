import { config } from "./config";
import BoardController from "./modules/BoardController";
import BoardInfo from "./modules/BoardInfo";

let boardInfo = new BoardInfo (
  config.cellRepeatWidth,
  config.spriteStartingBorderWidth,
  config.buttonSize,
  config.buttonBorderSize,
  config.columnsOnMap,
  config.rowsOnMap
);
let boardController = new BoardController(boardInfo);