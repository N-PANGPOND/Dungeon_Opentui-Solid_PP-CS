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
  const isChoice = () => props.screen === "EVENT" && (props.isEventChoice ?? false);
  const isAutoEvent = () => props.screen === "EVENT" && !props.isEventChoice;
  const attacking = () => props.isPlayerTurn ?? true;

  const title = () => {
    if (isChoice()) return " EVENT CHOICE ";
    if (isAutoEvent()) return " EVENT ";
    if (!isCombat()) return " CONTROLS ";
    return attacking() ? " ATTACK TURN " : " DEFEND TURN ";
  };
  const titleColor = () => (isChoice() ? theme.colors.success : isCombat() ? theme.colors.combat : theme.colors.title);
  const borderColor = () => (isChoice() ? theme.colors.success : isCombat() ? theme.colors.combat : theme.colors.borderPanel);

  const row1 = () => {
    if (isChoice()) return `1  ${theme.icons.potion} Take Potion`;
    if (isAutoEvent()) return "   (Please wait...)";
    if (isCombat()) return attacking() ? `1  ${theme.icons.atk} Attack` : `1  ${theme.icons.def} Defend`;
    return "W/A/S/D  Move";
  };

  const row2 = () => {
    if (isChoice()) return `2  ${theme.icons.bullet} Leave / Skip`;
    if (isAutoEvent()) return "   Auto-returning";
    if (isCombat()) return attacking() ? `2  ${theme.icons.bullet} Strike` : `2  ${theme.icons.bullet} Counter`;
    return "Arrow    Move";
  };

  const row3 = () => {
    if (isChoice() || isAutoEvent()) return " ";
    if (isCombat()) return `3  ${theme.icons.potion} Use Item`;
    return "I        Inventory";
  };

  const row4 = () => {
    if (isCombat()) return `4  ${theme.icons.bullet} Run`;
    return "ESC      Quit";
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
      <text fg={isChoice() ? theme.colors.success : isCombat() ? (attacking() ? theme.colors.danger : theme.colors.info) : isAutoEvent() ? theme.colors.textDim : theme.colors.primary}>
        {pad(row1(), 30)}
      </text>
      <text fg={isChoice() ? theme.colors.danger : isCombat() ? theme.colors.warning : theme.colors.textDim}>
        {pad(row2(), 30)}
      </text>
      <text fg={isCombat() ? theme.colors.success : theme.colors.textDim}>
        {pad(row3(), 30)}
      </text>
      <text fg={theme.colors.textDim}>
        {pad(row4(), 30)}
      </text>
    </box>
  );
};
