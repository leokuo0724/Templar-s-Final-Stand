import { GameObject } from "kontra";

export function tween(
  obj: GameObject,
  targetX: number,
  targetY: number,
  duration: number,
  delay: number = 0
) {
  return new Promise((resolve) => {
    const fps = 60; // Frames per second
    const steps = fps * (duration / 1000); // Total number of steps
    const stepX = (targetX - obj.x) / steps;
    const stepY = (targetY - obj.y) / steps;
    let currentStep = 0;

    function step() {
      if (currentStep < steps) {
        obj.x += stepX;
        obj.y += stepY;
        currentStep++;
        setTimeout(step, duration / steps);
      } else {
        // Ensure final positions are exact
        obj.x = targetX;
        obj.y = targetY;

        // Wait for the delay period before resolving the promise
        setTimeout(resolve, delay);
      }
    }
    step(); // Start the animation
  });
}
