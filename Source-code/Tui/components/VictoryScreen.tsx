import { theme, pad, fmtNum } from "../theme";
import type { PlayerUIProps } from "../uiTypes";

interface VictoryScreenProps {
  player: PlayerUIProps;
  rescuedWife: boolean;
}

export const VictoryScreen = (props: VictoryScreenProps) => {
  const p = () => props.player;
  const isGood = () => props.rescuedWife;

  const victoryLines = [
    "",
    "  ██╗   ██╗██╗ ██████╗████████╗ ██████╗ ██████╗ ██╗   ██╗",
    "  ██║   ██║██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝",
    "  ██║   ██║██║██║        ██║   ██║   ██║██████╔╝ ╚████╔╝",
    "  ╚██╗ ██╔╝██║██║        ██║   ██║   ██║██╔══██╗  ╚██╔╝",
    "   ╚████╔╝ ██║╚██████╗   ██║   ╚██████╔╝██║  ██║   ██║",
    "    ╚═══╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝",
    "",
  ];

  const escapedLines = [
    "",
    "  ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗██████╗ ",
    "  ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗",
    "  █████╗  ███████╗██║     ███████║██████╔╝█████╗  ██║  ██║",
    "  ██╔══╝  ╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝  ██║  ██║",
    "  ███████╗███████║╚██████╗██║  ██║██║     ███████╗██████╔╝",
    "  ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═════╝ ",
    "",
  ];

  const lines = () => (isGood() ? victoryLines : escapedLines);
  const themeColor = () => (isGood() ? theme.colors.success : theme.colors.warning);

  return (
    <box
      style={{
        borderStyle: theme.border.outer,
        borderColor: themeColor(),
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

      {/* ASCII art title — สลับตาม isGood() */}
      {lines().map((line) => (
        <text fg={themeColor()}>{pad(line, 78)}</text>
      ))}

      {/* ข้อความอธิบาย ending */}
      <text fg={isGood() ? theme.colors.wife : theme.colors.textDim}>
        {pad(
          isGood()
            ? "  💗  You rescued your wife and made it home together!  💗"
            : "  💀  You escaped alone... your wife is still trapped inside  💀",
          78
        )}
      </text>
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