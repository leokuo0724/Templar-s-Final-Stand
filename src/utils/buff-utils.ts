import {
  OptionalCharacterProps,
} from "../types/character";

export function checkIfBuff(buff: OptionalCharacterProps): boolean {
  for (const [key, value] of Object.entries(buff)) {
    if (key === "attackDirection") return value !== "front";
    if (key === "attackType") return value !== "normal";
    if (typeof value !== "number") throw new Error();
    return value > 0;
  }
  return false;
}
