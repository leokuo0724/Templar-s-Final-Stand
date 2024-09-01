import { on, SpriteClass, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { INFO_TEXT_CONFIG } from "../../constants/text";
import { EVENT } from "../../constants/event";
import { GameManager } from "../../managers/game-manager";
import { ItemCard } from "../sprites/card/item-card";
import { GRID_SIZE } from "../../constants/size";

const ITEM_PER_PAGE = 4;

export class ItemPanel extends SpriteClass {
  // private pageIdx = 0; // TODO: pagination

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

  private async onItemsUpdated(added: ItemCard[], removed: ItemCard[]) {
    if (added.length > 0) this.addChild(added);
    if (removed.length > 0) this.removeChild(removed);

    const gm = GameManager.getInstance();
    // mark all items as invisible
    await Promise.all(gm.currentItems.map((item) => item.setInactive(0)));
    await Promise.all(
      gm.currentItems
        .sort((a, b) => a.duration - b.duration)
        .slice(0, ITEM_PER_PAGE)
        .map((item, index) => item.setActive(60 + index * (GRID_SIZE + 4), 76))
    );
  }
}
