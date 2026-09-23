// =============================================================
// CombatView.tsx — Combat Screen Panel (Replaces MAP box)
// แสดง Monster Pixel Art ขนาดใหญ่เต็มช่องแมพ พร้อมข้อมูล Enemy HP และ Stats
// ข้อความเทิร์นและการกระทำถูกย้ายไปแสดงที่กล่อง LOG ด้านล่างเพื่อความสะอาดตา
// =============================================================

import { theme, renderBar, hpBarColor, pad, fmtNum } from "../theme";
import type { CombatUIProps } from "../uiTypes";
import path from "path";

const eventDataPath = path.join(import.meta.dir, "../../assets/Event/event.json");
const eventJsonRaw = await Bun.file(eventDataPath).json() as {
  "event@": {
    Combat: {
      normal: { screen: number[][] };
      elite:  { screen: number[][] };
      boss:   { screen: number[][] };
    };
  };
};
const combatScreens = eventJsonRaw["event@"].Combat;

const W = 90;            // ความกว้างเนื้อหา (94 หักขอบ 2 ข้าง)
const VIEW_COLS = 45;    // จำนวนคอลัมน์ pixel art (45 * 2 = 90 ตัวอักษร)
const ART_START_ROW = 2; // เริ่มแสดงตั้งแต่แถว 2 (เต็มตัว)
const ART_END_ROW = 26;  // ถึงแถว 26 (รวม 24 แถว)
const BAR_WIDTH = 26;    // ความยาวแถบเลือด

export const CombatView = (props: CombatUIProps) => {
  const e = () => props.enemy;

  const monsterType = () => {
    const name = e().name.toUpperCase();
    if (name.includes("BOSS")) return "boss";
    if (name.includes("ELITE")) return "elite";
    return "normal";
  };

  const monsterScreen = () => combatScreens[monsterType()]?.screen ?? combatScreens.normal.screen;

  const monsterColor = () => {
    const t = monsterType();
    if (t === "boss") return "#ef4444";
    if (t === "elite") return "#a78bfa";
    return "#f59e0b";
  };

  const monsterBadge = () => {
    const t = monsterType();
    if (t === "boss") return "💀 BOSS MONSTER";
    if (t === "elite") return "⚔ ELITE MONSTER";
    return "👹 MONSTER";
  };

  // ดึงภาพ pixel art ของมอนสเตอร์เต็มพื้นที่ 24 แถว
  const artLines = () =>
    monsterScreen()
      .slice(ART_START_ROW, ART_END_ROW)
      .map((row) =>
        row
          .slice(0, VIEW_COLS)
          .map((cell) => (cell === 1 ? "██" : "  "))
          .join("")
      );

  return (
    <box
      title=" ⚔ COMBAT BATTLE "
      titleColor={theme.colors.combat}
      style={{
        borderStyle: theme.border.panel,
        borderColor: monsterColor(),
        flexDirection: "column",
        width: "100%",
        height: 29,
        overflow: "hidden",
      }}
    >
      {/* ─── 1. Header: Enemy Info & HP Bar (2 บรรทัด) ─────────────── */}
      <box style={{ flexDirection: "row", paddingLeft: 2 }}>
        <text fg={monsterColor()}>{monsterBadge()}</text>
        <text fg={theme.colors.muted}>{"  |  "}</text>
        <text fg={theme.colors.hp}>HP: </text>
        <text fg={hpBarColor(e().hp, e().maxHp)}>
          {`[${renderBar(e().hp, e().maxHp, BAR_WIDTH)}] ${fmtNum(e().hp)} / ${fmtNum(e().maxHp)}`}
        </text>
        <text fg={theme.colors.muted}>{"  |  "}</text>
        <text fg={theme.colors.warning}>{`ATK: ${fmtNum(e().atk)}  `}</text>
        <text fg={theme.colors.info}>{`DEF: ${fmtNum(e().def)}`}</text>
      </box>
      <text fg={theme.colors.muted}>{pad("─".repeat(W), W)}</text>

      {/* ─── 2. Full Monster Pixel Art Stage (24 บรรทัด) ─────────────── */}
      {artLines().map((line) => (
        <text fg={monsterColor()}>{line}</text>
      ))}
    </box>
  );
};
