import { init } from "kontra";

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
