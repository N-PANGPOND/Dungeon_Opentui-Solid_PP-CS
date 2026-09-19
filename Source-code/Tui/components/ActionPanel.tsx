// =============================================================
// ActionPanel.tsx — Controls / Combat Actions Panel
// แสดง keybindings และ context-sensitive actions
// =============================================================

import { theme, pad } from "../theme";
import type { UIScreen } from "../uiTypes";

interface ActionPanelProps {
  screen: UIScreen;
}

export const ActionPanel = (props: ActionPanelProps) => {
  const isCombat = () => props.screen === "COMBAT";
  const title = () => (isCombat() ? " ACTIONS " : " CONTROLS ");
  const titleColor = () => (isCombat() ? theme.colors.combat : theme.colors.title);
  const borderColor = () => (isCombat() ? theme.colors.combat : theme.colors.borderPanel);

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
      <text fg={isCombat() ? theme.colors.danger : theme.colors.primary}>
        {pad(isCombat() ? `1  ${theme.icons.atk} Attack` : "W/A/S/D  Move", 30)}
      </text>
      <text fg={isCombat() ? theme.colors.warning : theme.colors.textDim}>
        {pad(isCombat() ? `2  ${theme.icons.bullet} Strike` : "Arrow    Move", 30)}
      </text>
      <text fg={isCombat() ? theme.colors.success : theme.colors.textDim}>
        {pad(isCombat() ? `3  ${theme.icons.potion} Use Item` : "I        Inventory", 30)}
      </text>
      <text fg={isCombat() ? theme.colors.info : theme.colors.textDim}>
        {pad(isCombat() ? `4  ${theme.icons.bullet} Run` : "ESC      Quit", 30)}
      </text>
    </box>
  );
};
