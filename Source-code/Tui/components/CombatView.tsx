// =============================================================
// CombatView.tsx — Combat Screen Panel
// แสดงศัตรู (HP/ATK/DEF), HP ของ player, และเป็นตาใคร
// แทนที่ DungeonView ตอน screen === "COMBAT" — ไม่คำนวณค่าใด ๆ เอง
// =============================================================

import { theme, renderBar, hpBarColor, pad, fmtNum } from "../theme";
import type { CombatUIProps } from "../uiTypes";
import { Show } from "solid-js";

const W = 78;        // ความกว้างเนื้อหาภายในกล่อง (กล่อง 82 - ขอบ)
const BAR_WIDTH = 30;

export const CombatView = (props: CombatUIProps) => {
  const e = () => props.enemy;
  const p = () => props.player;

  const enemyIcon = () => (e().name === "BOSS" ? theme.icons.boss : theme.icons.enemy);

  const enemyBar = () =>
    `   ${theme.icons.hp} ${renderBar(e().hp, e().maxHp, BAR_WIDTH)}  ${fmtNum(e().hp)} / ${fmtNum(e().maxHp)}`;
  const enemyStats = () =>
    `   ${theme.icons.atk} ATK ${fmtNum(e().atk)}    ${theme.icons.def} DEF ${fmtNum(e().def)}`;
  const playerBar = () =>
    `   ${theme.icons.hp} ${renderBar(p().hp, p().maxHp, BAR_WIDTH)}  ${fmtNum(p().hp)} / ${fmtNum(p().maxHp)}`;

  const turnText = () =>
    props.isPlayerTurn
      ? `   ${theme.icons.arrow} YOUR TURN — choose how to ATTACK (press 1-4)`
      : `   ${theme.icons.arrow} MONSTER'S TURN — choose how to DEFEND (press 1-4)`;
  const turnColor = () => (props.isPlayerTurn ? theme.colors.danger : theme.colors.info);

  return (
    <box
      title=" COMBAT "
      titleColor={theme.colors.combat}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.combat,
        flexDirection: "column",
        width: "100%",
        height: 29,
        overflow: "hidden",
      }}
    >
      <text>{" "}</text>

      {/* Enemy — emoji อยู่ใน <text> แยก ไม่ผ่าน pad() เพื่อไม่ให้ความกว้างเพี้ยน */}
      <box style={{ flexDirection: "row", paddingLeft: 3 }}>
        <text fg={theme.colors.enemy}>{`${enemyIcon()} `}</text>
        <text fg={theme.colors.enemy}>{e().name}</text>
      </box>
      <text fg={hpBarColor(e().hp, e().maxHp)}>{pad(enemyBar(), W)}</text>
      <text fg={theme.colors.textDim}>{pad(enemyStats(), W)}</text>

      <text>{" "}</text>
      <text fg={theme.colors.muted}>{pad("   " + "─".repeat(60), W)}</text>
      <text>{" "}</text>

      {/* Player */}
      <text fg={theme.colors.primary}>{pad("   YOU", W)}</text>
      <text fg={hpBarColor(p().hp, p().maxHp)}>{pad(playerBar(), W)}</text>

      <text>{" "}</text>
      <text fg={turnColor()}>{pad(turnText(), W)}</text>
      <text>{" "}</text>

      <Show when={props.lastLog}>
        <text fg={theme.colors.textDim}>{pad(`   ${props.lastLog}`, W)}</text>
      </Show>
    </box>
  );
};
