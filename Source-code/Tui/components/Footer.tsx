// =============================================================
// Footer.tsx — Global Key Hint Bar
// แสดง keybinding hint ที่ด้านล่างสุดของหน้าจอ
// =============================================================

import { theme, pad } from "../theme";
import type { UIScreen } from "../uiTypes";

interface FooterProps {
  screen: UIScreen;
  isPlayerTurn?: boolean; // ใช้เฉพาะตอน COMBAT — true = ตา player โจมตี (default)
}

function dungeonHints(): string {
  return "  W/A/S/D: Move    I: Inventory    ESC/Q: Quit";
}

function combatHints(attacking: boolean): string {
  return attacking
    ? "  1: Attack    2: Strike    3: Use Item    4: Run    ESC/Q: Quit"
    : "  1: Defend    2: Counter   3: Use Item    4: Run    ESC/Q: Quit";
}

export const Footer = (props: FooterProps) => {
  const hints = () =>
    pad(
      props.screen === "COMBAT" ? combatHints(props.isPlayerTurn ?? true) : dungeonHints(),
      114
    );

  return (
    <box
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.borderPanel,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 3,
        paddingLeft: 1,
      }}
    >
      <text fg={theme.colors.textDim}>{hints()}</text>
    </box>
  );
};
