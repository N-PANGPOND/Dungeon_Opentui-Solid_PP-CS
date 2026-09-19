// =============================================================
// Header.tsx — Game Title Header
// แสดงชื่อเกมและ Floor ปัจจุบัน
// =============================================================

import { theme, center } from "../theme";

interface HeaderProps {
  floor?: number;
  screen?: string;
}

export const Header = (props: HeaderProps) => {
  const floor = () => props.floor ?? 1;
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
      <text fg={theme.colors.coin}>{`Floor ${floor()}`}</text>
    </box>
  );
};

