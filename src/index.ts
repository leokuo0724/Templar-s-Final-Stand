import { GameLoop, init, initKeys } from "kontra";
import {
  INFO_PANEL_HEIGHT,
  InfoPanel,
} from "./components/info-section/info-panel";
import { BOARD_SIZE, Board } from "./components/board-section/board";
import { GameManager } from "./managers/game-manager";
import { Header } from "./components/board-section/header";
import { GameOverDialog } from "./components/dialog/game-over-dialog";
import { GameStartDialog } from "./components/dialog/game-start-dialog";

const { canvas } = init();

initKeys();
GameManager.getInstance();

function resize() {
  const { width: w, height: h } = canvas;
  const scale = Math.min(innerWidth / w, innerHeight / h, devicePixelRatio);
  canvas.style.width = canvas.width * scale + "px";
  canvas.style.height = canvas.height * scale + "px";
}
(onresize = resize)();

const infoPanel = new InfoPanel(0, canvas.height - INFO_PANEL_HEIGHT);
const board = new Board((canvas.width - BOARD_SIZE) / 2, 76);
const header = new Header();
const gameOverDialog = new GameOverDialog();
const gameStartDialog = new GameStartDialog();

const loop = GameLoop({
  update: () => {
    infoPanel.update();
    board.update();
    header.update();
    gameOverDialog.update();
    gameStartDialog.update();
  },
  render: () => {
    infoPanel.render();
    board.render();
    header.render();
    gameOverDialog.render();
    gameStartDialog.render();
  },
});
loop.start();
