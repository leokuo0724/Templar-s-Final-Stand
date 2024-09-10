import { GameLoop, init } from "kontra";
import {
  INFO_PANEL_HEIGHT,
  InfoPanel,
} from "./components/info-section/info-panel";
import { Board } from "./components/board-section/board";
import { GameManager } from "./managers/game-manager";
import { Header } from "./components/board-section/header";
import { GameOverDialog } from "./components/dialog/game-over-dialog";
import { GameStartDialog } from "./components/dialog/game-start-dialog";
import { PrologueDialog } from "./components/dialog/prologue-dialog";
import { IntroDialog } from "./components/dialog/intro-dialog";

const { canvas } = init();

GameManager.gI();

function resize() {
  const { width: w, height: h } = canvas;
  const scale = Math.min(innerWidth / w, innerHeight / h, devicePixelRatio);
  canvas.style.width = canvas.width * scale + "px";
  canvas.style.height = canvas.height * scale + "px";
}
(onresize = resize)();

const infoPanel = new InfoPanel(0, canvas.height - INFO_PANEL_HEIGHT);
const board = new Board(canvas.width / 2, 340);
const header = new Header();
const gameOverDialog = new GameOverDialog();
const gameStartDialog = new GameStartDialog();
const prologueDialog = new PrologueDialog();
const introDialog = new IntroDialog(canvas.width / 2, canvas.height - 150);

const loop = GameLoop({
  update: () => {
    infoPanel.update();
    board.update();
    header.update();
    gameOverDialog.update();
    prologueDialog.update();
    introDialog.update();
    gameStartDialog.update();
  },
  render: () => {
    infoPanel.render();
    board.render();
    header.render();
    gameOverDialog.render();
    prologueDialog.render();
    introDialog.render();
    gameStartDialog.render();
  },
});
loop.start();
