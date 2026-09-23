// =============================================================
// ShopView.tsx — Merchant Shop Screen Panel (Replaces MAP box)
// แสดงรายการสินค้าที่วางขาย, ราคา, คำอธิบาย, ยอดเงินคงเหลือ
// และโหมดขายไอเทมจากกระเป๋า
// =============================================================

import { theme, itemIcon, pad } from "../theme";
import type { InventoryUIProps, ShopUIProps } from "../uiTypes";
import { For, Show } from "solid-js";

interface ShopViewProps {
  shop: ShopUIProps;
  inventory: InventoryUIProps;
  mode: "buy" | "sell";
}

export const ShopView = (props: ShopViewProps) => {
  const s = () => props.shop;
  const inv = () => props.inventory;
  const isBuyMode = () => props.mode === "buy";

  return (
    <box
      title=" 🏪 MERCHANT SHOP "
      titleColor={theme.colors.info}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.info,
        flexDirection: "column",
        width: "100%",
        height: 29,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 1,
      }}
    >
      {/* ─── Header Info ────────────────────────────────────────────── */}
      <box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: 3,
        }}
      >
        <text fg={theme.colors.title}>
          {`Welcome traveler! Need some supplies for your journey?`}
        </text>
        <text fg={theme.colors.coin}>
          {`💰 Coins: ${s().playerCoins}`}
        </text>
      </box>

      {/* ─── Mode Indicator Tabs ───────────────────────────────────── */}
      <box
        style={{
          flexDirection: "row",
          width: "100%",
          height: 2,
          gap: 2,
        }}
      >
        <text fg={isBuyMode() ? theme.colors.primary : theme.colors.textDim}>
          {isBuyMode() ? "▶ [BUY MODE] (Press 1-5 to Buy)" : "  [B] Switch to Buy Mode"}
        </text>
        <text fg={!isBuyMode() ? theme.colors.warning : theme.colors.textDim}>
          {!isBuyMode() ? "▶ [SELL MODE] (Press 1-8 to Sell at 80% price)" : "  [S] Switch to Sell Mode"}
        </text>
      </box>

      <text fg={theme.colors.borderPanel}>
        {"─".repeat(88)}
      </text>

      {/* ─── Buy Mode: Shop Catalog ─────────────────────────────────── */}
      <Show when={isBuyMode()}>
        <box
          style={{
            flexDirection: "column",
            width: "100%",
            height: 14,
            paddingTop: 1,
          }}
        >
          <text fg={theme.colors.title}>
            {pad("  #   ITEM NAME", 24) + pad("PRICE", 14) + "DESCRIPTION"}
          </text>
          <text fg={theme.colors.muted}>
            {"  " + "─".repeat(84)}
          </text>
          <For each={s().items}>
            {(item) => {
              const affordable = s().playerCoins >= item.price;
              return (
                <box
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: 2,
                  }}
                >
                  <text fg={affordable ? theme.colors.primary : theme.colors.textDim}>
                    {pad(` [${item.index + 1}]  ${itemIcon(item.name)} ${item.name}`, 24)}
                  </text>
                  <text fg={affordable ? theme.colors.coin : theme.colors.danger}>
                    {pad(`${item.price} Coins`, 14)}
                  </text>
                  <text fg={theme.colors.text}>
                    {item.description}
                  </text>
                </box>
              );
            }}
          </For>
        </box>
      </Show>

      {/* ─── Sell Mode: Player Inventory ────────────────────────────── */}
      <Show when={!isBuyMode()}>
        <box
          style={{
            flexDirection: "column",
            width: "100%",
            height: 14,
            paddingTop: 1,
          }}
        >
          <text fg={theme.colors.warning}>
            {pad("  SLOT  ITEM IN BAG", 26) + pad("SELL VALUE (80%)", 20) + "DESCRIPTION"}
          </text>
          <text fg={theme.colors.muted}>
            {"  " + "─".repeat(84)}
          </text>
          <Show
            when={inv().items.length > 0}
            fallback={
              <text fg={theme.colors.muted}>
                {"\n  (Your inventory is empty. Nothing to sell.)"}
              </text>
            }
          >
            <For each={inv().items}>
              {(item, idx) => {
                // หา template item เพื่อดึงราคาขาย
                const shopMatch = s().items.find(si => si.name === item.name);
                const basePrice = shopMatch ? shopMatch.price : 20;
                const sellValue = Math.floor(basePrice * 0.8);

                return (
                  <box
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      height: 2,
                    }}
                  >
                    <text fg={theme.colors.warning}>
                      {pad(`  [${idx() + 1}]   ${itemIcon(item.name)} ${item.name}`, 26)}
                    </text>
                    <text fg={theme.colors.coin}>
                      {pad(`+${sellValue} Coins`, 20)}
                    </text>
                    <text fg={theme.colors.textDim}>
                      {item.description}
                    </text>
                  </box>
                );
              }}
            </For>
          </Show>
        </box>
      </Show>

    </box>
  );
};
