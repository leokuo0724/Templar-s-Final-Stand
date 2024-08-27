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
    if ((value as number) > 0) {
      return isAccurate ? `${key} +${value}` : `high ${key}`;
    } else {
      return isAccurate ? `${key} ${value}` : `low ${key}`;
    }
  });
  return buffTexts.join("\n");
};
