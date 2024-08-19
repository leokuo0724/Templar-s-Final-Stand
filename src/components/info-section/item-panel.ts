import { on, SpriteClass, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { INFO_TEXT_CONFIG } from "../../constants/text";
import { EVENT } from "../../constants/event";
import { GameManager } from "../../managers/game-manager";
import { ItemCard } from "../sprites/card/item-card";
import { GRID_SIZE } from "../../constants/size";

const ITEM_PER_PAGE = 4;

export class ItemPanel extends SpriteClass {
  // private pageIdx = 0;

  constructor(x: number, y: number) {
    super({
      x,
      y,
      width: 462,
      height: 136,
      color: COLOR.YELLOW_7,
    });

    const titleText = Text({
      text: "Items",
      x: 12,
      y: 9,
      ...INFO_TEXT_CONFIG,
    });
    this.addChild([titleText]);

    on(EVENT.ITEMS_UPDATED, this.onItemsUpdated.bind(this));
  }

  private onItemsUpdated(itemCards: ItemCard[]) {
    this.addChild(itemCards);
    this.pageIdx = 0;
    const gm = GameManager.getInstance();
    // mark all items as invisible
    gm.currentItems.forEach((item) => item.setInactive(0));
    // show first 4 items
    gm.currentItems
      .slice(0, ITEM_PER_PAGE)
      .forEach((item, index) =>
        item.setActive(60 + index * (GRID_SIZE + 4), 76)
      );
  }
}
