import {
  AttackDirection,
  AttackType,
  OptionalCharacterProps,
} from "../types/character";

export function checkIfBuff(buff: OptionalCharacterProps): boolean {
  for (const [key, value] of Object.entries(buff)) {
    if (key === "attackDirection") return value !== AttackDirection.F;
    if (key === "attackType") return value !== AttackType.N;
    if (typeof value !== "number") throw new Error();
    return value > 0;
  }
  return false;
}
