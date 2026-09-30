// =============================================================
// ActionPanel.tsx — Controls / Combat Actions Panel
// แสดง keybindings และ context-sensitive actions
//
// Combat เป็นแบบผลัดกัน: ตา player โจมตีได้เลือก Attack/Strike,
// ตา monster โจมตี player เลือก Defend/Counter — ปุ่มยังเป็น 1-4 เหมือนกัน
// =============================================================

import { theme, pad } from "../theme";
import type { UIScreen } from "../uiTypes";

interface ActionPanelProps {
  screen: UIScreen;
  isPlayerTurn?: boolean;  // true = ตา player โจมตี (default), false = ตา player ป้องกัน
  isEventChoice?: boolean; // true = เฉพาะเมื่อเป็น Event ที่มีตัวเลือกให้กด (เช่น Potion)
}

export const ActionPanel = (props: ActionPanelProps) => {
  const isCombat = () => props.screen === "COMBAT";
  const isInventory = () => props.screen === "INVENTORY";
  const isShop = () => props.screen === "SHOP";
  const isChoice = () => props.screen === "EVENT" && (props.isEventChoice ?? false);
  const isAutoEvent = () => props.screen === "EVENT" && !props.isEventChoice;
  const attacking = () => props.isPlayerTurn ?? true;

  const title = () => {
    if (isInventory()) return " INVENTORY ";
    if (isShop()) return " SHOP CONTROLS ";
    if (isChoice()) return " EVENT CHOICE ";
    if (isAutoEvent()) return " EVENT ";
    if (!isCombat()) return " CONTROLS ";
    return attacking() ? " ATTACK TURN " : " DEFEND TURN ";
  };
  const titleColor = () => (isShop() ? theme.colors.info : isChoice() ? theme.colors.success : isCombat() ? theme.colors.combat : theme.colors.title);
  const borderColor = () => (isShop() ? theme.colors.info : isChoice() ? theme.colors.success : isCombat() ? theme.colors.combat : theme.colors.borderPanel);

  const row1 = () => {
    return attacking() ? `1  ${theme.icons.atk} Attack` : `1  ${theme.icons.def} Defend`;
  };

  const row2 = () => {
    return attacking() ? `2  ${theme.icons.bullet} Strike` : `2  ${theme.icons.bullet} Counter`;
  };

  return (
    <box
      title={title()}
      titleColor={titleColor()}
      style={{
        borderStyle: theme.border.panel,
        borderColor: borderColor(),
        flexDirection: "column",
        width: "100%",
        height: 10,
        paddingLeft: 1,
        paddingTop: 1,
      }}
    >
      <text fg={isCombat() ? (attacking() ? theme.colors.danger : theme.colors.info) : theme.colors.primary}>
      {pad(isCombat() ? row1() : isInventory() ? "1-8      Select" : "W/A/S/D  Move", 30)}
      </text>
      <text fg={isCombat() ? theme.colors.warning : theme.colors.textDim}>
        {pad(isCombat() ? row2() : isInventory() ? "U        Use" : "Arrow    Move", 30)}
      </text>
      <text fg={isCombat() ? theme.colors.success : theme.colors.textDim}>
        {pad(isCombat() ? `3  ${theme.icons.potion} Use Item` : isInventory() ? "X        Discard" : "I        Inventory", 30)}
      </text>
      <text fg={isCombat() ? theme.colors.info : theme.colors.textDim}>
        {pad(isCombat() ? `4  ${theme.icons.bullet} Run` : isInventory() ? "I        Back" : "ESC      Quit", 30)}
      </text>
    </box>
  );
};
