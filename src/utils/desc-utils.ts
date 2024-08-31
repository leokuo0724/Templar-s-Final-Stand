import { OptionalCharacterProps } from "../types/character";

export const getEnemyPropsDescText = (buff: OptionalCharacterProps) =>
  getCharacterPropsDescText(buff, false);

export const getItemPropsDescText = (buff: OptionalCharacterProps) =>
  getCharacterPropsDescText(buff, true);

const getCharacterPropsDescText = (
  buff: OptionalCharacterProps,
  isAccurate: boolean
) => {
  const buffTexts = Object.entries(buff).map(([key, value]) => {
    if (!value) return "";
    if (key === "attackDirection") return `range: ${value}`;
    if (key === "attackType") return `type: ${value}`;
    const percentageKeys = ["hitRate", "criticalRate"];
    if ((value as number) > 0) {
      if (!isAccurate) return `high ${key}`;
      if (percentageKeys.includes(key)) {
        return `${key} +${((value as number) * 100).toFixed()}%`;
      }
      return `${key} +${value}`;
    } else {
      if (!isAccurate) return `low ${key}`;
      if (percentageKeys.includes(key)) {
        return `${key} ${((value as number) * 100).toFixed()}%`;
      }
      return `${key} ${value}`;
    }
  });
  return buffTexts.join("\n");
};
