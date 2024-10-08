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
  protected wT: Text; // weight text

  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.T,
      x,
      y,
      belongs: Belongs.PLAYER,
    });
    this.resetProps();
    this.wT = Text({
      text: `${this.weight}`,
      x: -24,
      y: 40,
      ...COMMON_TEXT_CONFIG,
    });
    this.main.addChild([new WeightIcon(-46, 32), this.wT]);
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
    const gm = GameManager.gI();
    gm.gameOver();
  }

  private updateCls(cls: TemplarClass) {
    this.cls = cls;
    this.resetProps();
  }

  protected resetProps(): void {
    const { isD, isK, isW } = GameManager.gI();
    this.health = isW ? 6 : 10;
    this.shield = isD ? 10 : 0;
    this.attack = isK ? 4 : 1;
    this.hitRate = isW ? 0.65 : 0.8;
    this.critical = 0.1;
    this.attackDirection = AttackDirection.F;
    this.attackType = AttackType.N;
    this.hitBack = isD ? this.shield : 0;
    if (isD) this.updateWeight(3);
    this.refreshText();
    emit(EVENT.UPDATE_TEMPLAR_INFO, this);
  }

  public updateWeight(value: number): void {
    this.weight += value;
    this.wT.text = `${this.weight}`;
    const isOverweight = this.weight >= 13;
    this.wT.color = isOverweight ? COLOR.BROWN_8 : COLOR.WHITE_6;
    emit(EVENT.UPDATE_TEMPLAR_WEIGHT, isOverweight);
  }
}
