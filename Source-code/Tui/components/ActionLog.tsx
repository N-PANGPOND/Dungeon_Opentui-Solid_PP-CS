// =============================================================
// ActionLog.tsx — Scrollable Game Log Panel
// แสดง log การกระทำในเกม (combat, movement, system messages)
// =============================================================

import { theme, pad } from "../theme";
import type { logType } from "../../Type-Enum/type";
import { For, Show } from "solid-js";

interface ActionLogProps {
  logs: logType[];
}

export function formatLogText(text: string): string {
  let s = text;
  // แปลงข้อความภาษาไทยเป็นข้อความ terminal-safe เพื่อป้องกัน terminal cursor drift
  s = s.replace(/คุณเจอมอนสเตอร์!!/g, "Encountered a Monster!!");
  s = s.replace(/Monster เลือก action:\s*(\w+)/g, "Monster chooses: $1");
  s = s.replace(/is Not Walkable/g, "Path is blocked");
  s = s.replace(/Monster isDead/g, "Monster was defeated!");
  s = s.replace(/คุณชนะแล้ว!/g, "Victory! You won the battle!");
  s = s.replace(/คุณแพ้แล้ว.../g, "Defeat! You were slain in battle...");
  s = s.replace(/จบเกม ขอบคุณที่เล่น/g, "Game Over. Thanks for playing!");

  // จัดรูปแบบ combat damage log:
  // e.g. "Player โจมตี Monster เข้า 6.25 damage, HP เหลือ 93.75/100 (จาก 100)"
  const dmgMatch = s.match(/(Player|Monster)\s*โจมตี\s*(Player|Monster)\s*เข้า\s*([\d.]+)\s*damage,\s*HP\s*เหลือ\s*([\d.\/]+)\s*\(จาก\s*([\d.]+)\)/);
  if (dmgMatch) {
    const [, source, target, dmg, hpRemaining] = dmgMatch;
    s = `${source} hits ${target} for ${dmg} DMG! (HP: ${hpRemaining})`;
  }

  // ตัด combining diacritics ที่อาจหลุดมา
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // จำกัดความยาวไม่เกิน 74 ตัวอักษรเพื่อไม่ให้ล้นขอบ
  if (s.length > 74) {
    s = s.slice(0, 71) + "...";
  }

  return s;
}

function logColor(log: logType): string {
  const t = log.text.toLowerCase();
  if (t.includes("damage") || t.includes("โจมตี") || t.includes("hits") || t.includes("hp")) return theme.colors.danger;
  if (t.includes("ชนะ") || t.includes("victory") || t.includes("defeated") || t.includes("monster isdead")) return theme.colors.success;
  if (t.includes("แพ้") || t.includes("defeat") || t.includes("dead") || t.includes("slain")) return theme.colors.enemy;
  if (t.includes("มอนสเตอร์") || t.includes("encounter") || t.includes("monster")) return theme.colors.warning;
  return theme.colors.text;
}

export const ActionLog = (props: ActionLogProps) => {
  return (
    <box
      title=" LOG "
      titleColor={theme.colors.borderPanel}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.borderPanel,
        flexDirection: "column",
        width: "100%",
        height: 6,
        overflow: "hidden",
      }}
    >
      <scrollbox
        stickyScroll={true}
        stickyStart="bottom"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Show when={props.logs.length === 0}>
          <text fg={theme.colors.textDim}>{pad("  — No logs yet —", 76)}</text>
        </Show>
        <For each={props.logs}>
          {(entry) => (
            <text fg={logColor(entry)}>
              {pad(`  ${theme.icons.bullet} ${formatLogText(entry.text)}`, 76)}
            </text>
          )}
        </For>
      </scrollbox>
    </box>
  );
};
