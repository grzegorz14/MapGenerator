import { config } from "./config";
import BoardController from "./modules/BoardController";

let boardController = new BoardController(
  config.imageId,
  config.imageContainerId,
  config.mapContainerId,
  config.selectionDivId,
  config.autoCheckboxId,
  config.cellRepeatWidth,
  config.spriteStartingBorderWidth,
  config.buttonSize,
  config.buttonBorderSize,
  config.columnsOnMap,
  config.rowsOnMap
)