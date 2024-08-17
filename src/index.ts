import { GameLoop, init } from "kontra";
import {
  INFO_PANEL_HEIGHT,
  InfoPanel,
} from "./components/info-section/info-panel";

const { canvas } = init();

function resize() {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const scale = Math.min(innerWidth / w, innerHeight / h, 1);
  canvas.style.width = canvas.width * scale + "px";
  canvas.style.height = canvas.height * scale + "px";
  if (ctx) ctx.imageSmoothingEnabled = false;
}
(onresize = resize)();

const infoPanel = new InfoPanel(0, canvas.height - INFO_PANEL_HEIGHT);

const loop = GameLoop({
  update: () => {
    infoPanel.update();
  },
  render: () => {
    infoPanel.render();
  },
});
loop.start();
