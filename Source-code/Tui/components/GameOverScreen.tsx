// =============================================================
// GameOverScreen.tsx — Game Over Full-Screen Panel
// แสดงเมื่อ player ตาย (GAMEOVER screen)
// =============================================================

import { theme, renderBar, pad, center } from "../theme";
import type { PlayerUIProps } from "../uiTypes";

interface GameOverScreenProps {
  player: PlayerUIProps;
}

export const GameOverScreen = (props: GameOverScreenProps) => {
  const p = () => props.player;

  const lines = [
    "",
    "  ██████╗  █████╗ ███╗   ███╗███████╗",
    "  ██╔════╝ ██╔══██╗████╗ ████║██╔════╝",
    "  ██║  ███╗███████║██╔████╔██║█████╗",
    "  ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝",
    "  ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗",
    "   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝",
    "",
    "   ██████╗ ██╗   ██╗███████╗██████╗",
    "  ██╔═══██╗██║   ██║██╔════╝██╔══██╗",
    "  ██║   ██║██║   ██║█████╗  ██████╔╝",
    "  ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗",
    "  ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║",
    "   ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝",
    "",
  ];

  return (
    <box
      style={{
        borderStyle: theme.border.outer,
        borderColor: theme.colors.danger,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 120,
        height: 40,
      }}
    >
      {/* ASCII art title */}
      {lines.map((line) => (
        <text fg={theme.colors.danger}>{pad(line, 78)}</text>
      ))}

      {/* Divider */}
      <text fg={theme.colors.muted}>{pad("─".repeat(50), 78)}</text>
      <text>{" "}</text>

      {/* Final stats */}
      <text fg={theme.colors.textDim}>{pad(`  ${theme.icons.hp}  Final HP:    0 / ${p().maxHp}`, 78)}</text>
      <text fg={theme.colors.warning}>{pad(`  ${theme.icons.atk}  ATK:   ${p().atk}`, 78)}</text>
      <text fg={theme.colors.info}>{pad(`  ${theme.icons.def}  DEF:   ${p().def}`, 78)}</text>
      <text fg={theme.colors.coin}>{pad(`  ${theme.icons.coin}  Coins: ${p().coin}`, 78)}</text>
      <text>{" "}</text>

      {/* Prompt */}
      <text fg={theme.colors.textDim}>{pad("  Press  ESC  to exit", 78)}</text>
    </box>
  );
};
