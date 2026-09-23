// =============================================================
// GoodEndScreen.tsx — Good End Full-Screen Panel
// แสดงเมื่อ player ถึง Exit (GOOD END screen)
// =============================================================

import { theme, pad, fmtNum } from "../theme";
import type { PlayerUIProps } from "../uiTypes";

interface GoodEndScreenProps {
  player: PlayerUIProps;
}

export const GoodEndScreen = (props: GoodEndScreenProps) => {
  const p = () => props.player;

  const lines = [
    "",
    "  ██╗   ██╗██╗ ██████╗████████╗ ██████╗ ██████╗ ██╗   ██╗",
    "  ██║   ██║██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝",
    "  ██║   ██║██║██║        ██║   ██║   ██║██████╔╝ ╚████╔╝",
    "  ╚██╗ ██╔╝██║██║        ██║   ██║   ██║██╔══██╗  ╚██╔╝",
    "   ╚████╔╝ ██║╚██████╗   ██║   ╚██████╔╝██║  ██║   ██║",
    "    ╚═══╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝",
    "",
  ];

  return (
    <box
      style={{
        borderStyle: theme.border.outer,
        borderColor: theme.colors.success,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 120,
        height: 40,
      }}
    >
      {/* Decorative top */}
      <text fg={theme.colors.coin}>{pad("  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦", 78)}</text>
      <text>{" "}</text>

      {/* ASCII art title */}
      {lines.map((line) => (
        <text fg={theme.colors.success}>{pad(line, 78)}</text>
      ))}
      
      <text fg={theme.colors.success}>{pad("  คุณพาภรรยาออกจากดันเจี้ยนได้สำเร็จ!", 78)}</text>
      <text>{" "}</text>

      {/* Divider */}
      <text fg={theme.colors.muted}>{pad("─".repeat(50), 78)}</text>
      <text>{" "}</text>

      {/* Final stats */}
      <text fg={theme.colors.hp}>{pad(`  ${theme.icons.hp}  HP:    ${fmtNum(p().hp)} / ${fmtNum(p().maxHp)}`, 78)}</text>
      <text fg={theme.colors.warning}>{pad(`  ${theme.icons.atk}  ATK:   ${p().atk}`, 78)}</text>
      <text fg={theme.colors.info}>{pad(`  ${theme.icons.def}  DEF:   ${p().def}`, 78)}</text>
      <text fg={theme.colors.coin}>{pad(`  ${theme.icons.coin}  Coins: ${p().coin}`, 78)}</text>
      <text>{" "}</text>

      {/* Decorative bottom */}
      <text fg={theme.colors.coin}>{pad("  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦", 78)}</text>
      <text>{" "}</text>

      {/* Prompt */}
      <text fg={theme.colors.textDim}>{pad("  Press  ESC  to exit", 78)}</text>
    </box>
  );
};
