import { theme, pad, itemIcon } from "../theme";
import type { InventoryUIProps } from "../uiTypes";
import { For, Show } from "solid-js";

export const InventoryView = (props: InventoryUIProps & { selectedSlot?: number | null }) => {
  const items = () => props.items;
  const used  = () => items().length;
  const W = 78;
  const rowColor = (idx: number) => idx === props.selectedSlot ? theme.colors.borderActive : theme.colors.text;
  
  return (
    <box
      title=" INVENTORY "
      titleColor={theme.colors.secondary}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.secondary,
        flexDirection: "column",
        width: "100%",
        height: 29,
      }}
    >
    <Show when={used() === 0}>
        <text fg={theme.colors.muted}>{pad("  (empty)", W)}</text>
    </Show>

    <For each={items()}>
    {(item, idx) => (
        <text fg={rowColor(idx())}>
            {pad(`[${idx() + 1}] ${itemIcon(item.name)} ${item.name} - ${item.description}`, W)}
        </text>
        )}
        </For>
    </box>
  );
};
