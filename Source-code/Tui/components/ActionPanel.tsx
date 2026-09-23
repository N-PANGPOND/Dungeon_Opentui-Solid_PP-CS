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
  isPlayerTurn?: boolean; // true = ตา player โจมตี (default), false = ตา player ป้องกัน
}

export const ActionPanel = (props: ActionPanelProps) => {
  const isCombat = () => props.screen === "COMBAT";
  const isInventory = () => props.screen === "INVENTORY";
  const attacking = () => props.isPlayerTurn ?? true;

  const title = () => {
    if (isInventory()) return " INVENTORY ";    
    if (!isCombat()) return " CONTROLS ";
    return attacking() ? " ATTACK TURN " : " DEFEND TURN ";
  };
  const titleColor = () => (isCombat() ? theme.colors.combat : theme.colors.title);
  const borderColor = () => (isCombat() ? theme.colors.combat : theme.colors.borderPanel);

  // แถวที่ 1-2 ของ combat เปลี่ยนตามตา (แถว 3-4 เหมือนกันทั้งสองตา)
  const row1 = () =>
    attacking() ? `1  ${theme.icons.atk} Attack` : `1  ${theme.icons.def} Defend`;
  const row2 = () =>
    attacking() ? `2  ${theme.icons.bullet} Strike` : `2  ${theme.icons.bullet} Counter`;

  return (
    <box
      title={title()}
      titleColor={titleColor()}
      style={{
        borderStyle: theme.border.panel,
        borderColor: borderColor(),
        flexDirection: "column",
        width: "100%",
        height: 8,
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
