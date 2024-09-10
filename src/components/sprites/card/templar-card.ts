import { Belongs, CardType } from "./type";

import { Templar } from "../templar";
import { CharacterCard } from "./character-card";
import { AttackDirection, AttackType } from "../../../types/character";
import { emit, on, Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { WeightIcon } from "../icons/weight-icon";
import { COLOR } from "../../../constants/color";
import { EVENT } from "../../../constants/event";
import { GameManager, TemplarClass } from "../../../managers/game-manager";

export class TemplarCard extends CharacterCard {
  public weight = 0;
  protected weightText: Text;

  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.TEMPLAR,
      x,
      y,
      belongs: Belongs.PLAYER,
    });
    this.resetProps();
    this.weightText = Text({
      text: `${this.weight}`,
      x: -24,
      y: 40,
      ...COMMON_TEXT_CONFIG,
    });
    this.main.addChild([new WeightIcon(-46, 32), this.weightText]);
    on(EVENT.UPDATE_TEMPLAR_CLASS, this.updateCls.bind(this));
  }

  protected getMainIcon() {
    const templar = new Templar({
      x: -21,
      y: -30,
      condition: "b",
    });
    return templar;
  }

  protected deathCallback() {
    const gm = GameManager.getInstance();
    gm.gameOver();
  }

  private updateCls(cls: TemplarClass) {
    this.cls = cls;
    this.resetProps();
  }

  protected resetProps(): void {
    const { isDefender, isKnight, isWizard } = GameManager.getInstance();
    this.health = isWizard ? 6 : 10;
    this.shield = isDefender ? 10 : 0;
    this.attack = isKnight ? 4 : 1;
    this.hitRate = isWizard ? 0.65 : 0.8;
    this.critical = 0.1;
    this.attackDirection = AttackDirection.FRONT;
    this.attackType = AttackType.NORMAL;
    this.hitBack = isDefender ? this.shield : 0;
    if (isDefender) this.updateWeight(3);
    this.refreshText();
    emit(EVENT.UPDATE_TEMPLAR_INFO, this);
  }

  public updateWeight(value: number): void {
    this.weight += value;
    this.weightText.text = `${this.weight}`;
    const isOverweight = this.weight >= 13;
    this.weightText.color = isOverweight ? COLOR.BROWN_8 : COLOR.WHITE_6;
    emit(EVENT.UPDATE_TEMPLAR_WEIGHT, isOverweight);
  }
}
