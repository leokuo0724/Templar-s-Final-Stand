import { GameObject } from "kontra";

export function tween(
  obj: GameObject,
  config: {
    targetX?: number;
    targetY?: number;
    opacity?: number;
  },
  duration: number,
  delay: number = 0
) {
  return new Promise((resolve) => {
    const { targetX, targetY, opacity } = config;
    const fps = 60; // Frames per second
    const steps = fps * (duration / 1000); // Total number of steps
    const stepX = targetX === undefined ? 0 : (targetX - obj.x) / steps;
    const stepY = targetY === undefined ? 0 : (targetY - obj.y) / steps;
    const stepOpacity =
      opacity === undefined ? 0 : (opacity - obj.opacity) / steps;
    let currentStep = 0;

    function step() {
      if (currentStep < steps) {
        obj.x += stepX;
        obj.y += stepY;
        obj.opacity += stepOpacity;
        currentStep++;
        setTimeout(step, duration / steps);
      } else {
        // Ensure final positions are exact
        obj.x = targetX === undefined ? obj.x : targetX;
        obj.y = targetY === undefined ? obj.y : targetY;
        obj.opacity = opacity === undefined ? obj.opacity : opacity;

        // Wait for the delay period before resolving the promise
        setTimeout(resolve, delay);
      }
    }
    step(); // Start the animation
  });
}
