// =============================================================
// Header.tsx — Game Title Header
// แสดงชื่อเกมและ Floor ปัจจุบัน
// =============================================================

import { theme, pad,center } from "../theme";

interface HeaderProps {
  screen?: string;
  isPlayerTurn?: boolean;
}

function dungeonHints(): string {
  return "  W/A/S/D: Move    I: Inventory    ESC/Q: Quit";
}

function combatHints(attacking: boolean): string {
  return attacking
    ? "  1: Attack    2: Strike    3: Use Item    4: Run    ESC/Q: Quit"
    : "  1: Defend    2: Counter   3: Use Item    4: Run    ESC/Q: Quit";
}

function shopHints(): string {
  return "  1-5: Buy    S: Sell Mode    B: Buy Mode    L/ESC: Leave Shop";
}

export const Header = (props: HeaderProps) => {
  const hints = () => {
    if (props.screen === "COMBAT") return combatHints(props.isPlayerTurn ?? true);
    if (props.screen === "SHOP") return shopHints();
    return dungeonHints();
  };
      
  const titleText = () => `${theme.icons.title}  ESCAPE DUNGEON  ${theme.icons.title}`;

  return (
    <box
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.borderOuter,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 3,
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <text fg={theme.colors.title}>{titleText()}</text>
      <text fg={theme.colors.textDim}>{`${hints()}`}</text>
    </box>
  );
};

