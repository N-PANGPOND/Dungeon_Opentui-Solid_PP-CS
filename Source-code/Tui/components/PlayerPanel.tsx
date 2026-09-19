// =============================================================
// PlayerPanel.tsx — Player Status HUD
// แสดง HP bar, ATK, DEF, Coin — ไม่คำนวณค่าใด ๆ เอง
// =============================================================

import { theme, renderBar, hpBarColor, pad } from "../theme";
import type { PlayerUIProps } from "../uiTypes";

interface PlayerPanelProps {
  player: PlayerUIProps;
}

export const PlayerPanel = (props: PlayerPanelProps) => {
  const p = () => props.player;

  // HP Bar
  const hpBar   = () => renderBar(p().hp, p().maxHp, 14);
  const hpColor = () => hpBarColor(p().hp, p().maxHp);
  const hpText  = () => `${p().hp} / ${p().maxHp}`;

  return (
    <box
      title=" PLAYER "
      titleColor={theme.colors.title}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.borderActive,
        flexDirection: "column",
        width: "100%",
        height: 12,
        paddingLeft: 1,
        paddingTop: 1,
      }}
    >
      {/* HP */}
      <text fg={theme.colors.hpHigh}>{pad(`${theme.icons.hp} HP`, 30)}</text>
      <text fg={hpColor()}>{pad(`${hpBar()}`, 30)}</text>
      <text fg={theme.colors.text}>{pad(`  ${hpText()}`, 30)}</text>
      <text>{pad(" ", 30)}</text>
      {/* Stats */}
      <text fg={theme.colors.warning}>{pad(`${theme.icons.atk} ATK    ${p().atk}`, 30)}</text>
      <text fg={theme.colors.info}>{pad(`${theme.icons.def} DEF    ${p().def}`, 30)}</text>
      {/* Coin */}
      <text fg={theme.colors.coin}>{pad(`${theme.icons.coin} Coin   ${p().coin}`, 30)}</text>
    </box>
  );
};
