// =============================================================
// InventoryPanel.tsx — Inventory Display Panel
// แสดงรายการ Item ในกระเป๋า — ไม่มี item logic ใด ๆ
// =============================================================

import { theme, itemIcon, pad } from "../theme";
import type { InventoryUIProps } from "../uiTypes";
import { For, Show } from "solid-js";

interface InventoryPanelProps {
  inventory: InventoryUIProps;
}

export const InventoryPanel = (props: InventoryPanelProps) => {
  const inv  = () => props.inventory;
  const used = () => inv().items.length;
  const max  = () => inv().maxSlots;

  return (
    <box
      title=" INVENTORY "
      titleColor={theme.colors.title}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.borderPanel,
        flexDirection: "column",
        width: "100%",
        height: 12,
        paddingLeft: 1,
        paddingTop: 1,
      }}
    >
      {/* Slot indicator */}
      <text fg={theme.colors.textDim}>{pad(`Slots: ${used()} / ${max()}`, 30)}</text>
      <text>{pad(" ", 30)}</text>

      {/* Empty state */}
      <Show when={used() === 0}>
        <text fg={theme.colors.muted}>{pad("  (empty)", 30)}</text>
      </Show>

      {/* Item list */}
      <For each={inv().items}>
        {(item, idx) => (
          <text fg={theme.colors.text}>
            {pad(`[${idx() + 1}] ${itemIcon(item.name)} ${item.name}`, 30)}
          </text>
        )}
      </For>
    </box>
  );
};
