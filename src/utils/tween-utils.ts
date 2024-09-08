import { GameObject } from "kontra";
import { GameManager } from "../managers/game-manager";

export function tween(
  obj: GameObject,
  config: {
    targetX?: number;
    targetY?: number;
    opacity?: number;
    scale?: number;
  },
  duration: number,
  delay: number = 0
) {
  return new Promise((resolve) => {
    const { speed } = GameManager.getInstance();
    const { targetX, targetY, opacity } = config;
    const fps = 60; // Frames per second
    const steps = fps * (duration / 1000); // Total number of steps
    const stepX = targetX === undefined ? 0 : (targetX - obj.x) / steps;
    const stepY = targetY === undefined ? 0 : (targetY - obj.y) / steps;
    const stepOpacity =
      opacity === undefined ? 0 : (opacity - obj.opacity) / steps;
    const stepScale =
      config.scale === undefined ? 0 : (config.scale - obj.scaleX) / steps;
    let currentStep = 0;

    function step() {
      if (currentStep < steps) {
        obj.x += stepX;
        obj.y += stepY;
        obj.opacity += stepOpacity;
        currentStep++;
        obj.scaleX += stepScale;
        obj.scaleY += stepScale;
        setTimeout(step, duration / steps / speed);
      } else {
        // Ensure final positions are exact
        obj.x = targetX === undefined ? obj.x : targetX;
        obj.y = targetY === undefined ? obj.y : targetY;
        obj.opacity = opacity === undefined ? obj.opacity : opacity;
        obj.scaleX = config.scale === undefined ? obj.scaleX : config.scale;
        obj.scaleY = config.scale === undefined ? obj.scaleY : config.scale;

        // Wait for the delay period before resolving the promise
        setTimeout(resolve, delay / speed);
      }
    }
    step(); // Start the animation
  });
}
