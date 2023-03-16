import { config } from "./config";
import BoardController from "./modules/BoardController";

let boardController = new BoardController(
  config.cellRepeatWidth,
  config.spriteStartingBorderWidth,
  config.buttonSize,
  config.buttonBorderSize,
  config.columnsOnMap,
  config.rowsOnMap
)