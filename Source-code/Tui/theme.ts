// =============================================================
// theme.ts — Dungeon TUI Central Theme
// ทุก Component ต้องใช้ค่าจากไฟล์นี้เท่านั้น ห้ามเขียนสีหรือ icon ตรง ๆ ใน Component
// =============================================================

export const theme = {
  colors: {
    primary:      "#4ade80",
    secondary:    "#a78bfa",
    title:        "#fbbf24",
    muted:        "#4b5563",
    text:         "#d1d5db",
    textDim:      "#6b7280",
    borderOuter:  "#4ade80",
    borderPanel:  "#166534",
    borderActive: "#fbbf24",
    hpHigh:       "#22c55e",
    hpMid:        "#f59e0b",
    hpLow:        "#ef4444",
    expColor:     "#06b6d4",
    danger:       "#ef4444",
    warning:      "#f59e0b",
    success:      "#22c55e",
    info:         "#06b6d4",
    enemy:        "#f87171",
    combat:       "#f59e0b",
    coin:         "#fbbf24",
    exit:         "#60a5fa",
    wife:         "#f472b6",
    wall:         "#64748b",
    floor:        "#1e293b",
    // Convenience aliases used by GameOverScreen/VictoryScreen
    hp:           "#22c55e",
    atk:          "#f59e0b",
    def:          "#06b6d4",
  },

  border: {
    outer:   "double"   as const,
    panel:   "single"   as const,
    rounded: "rounded"  as const,
    none:    "none"     as const,
  },

  icons: {
    player:  "🦸",
    enemy:   "👹",
    boss:    "💀",
    exit:    "🚪",
    wife:    "💗",
    hp:      "♥",
    atk:     "⚔",
    def:     "◈",
    coin:    "●",
    exp:     "★",
    potion:  "⊕",
    sword:   "†",
    key:     "⚷",
    smoke:   "◈",
    title:   "⚔",
    arrow:   "▶",
    bullet:  "•",
    wall:     ["██","█▒","▒█","▓▒"],
    floor:   "  ",
  },

  bar: {
    filled: "█",
    empty:  "░",
    width:  10,
  },
} as const;

// ─── Helper Functions ──────────────────────────────────────────────────────

export function renderBar(
  current: number,
  max: number,
  width: number = theme.bar.width
): string {
  if (max <= 0) return theme.bar.empty.repeat(width);
  const ratio = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  return theme.bar.filled.repeat(filled) + theme.bar.empty.repeat(empty);
}

export function hpBarColor(current: number, max: number): string {
  const pct = max > 0 ? current / max : 0;
  if (pct >= 0.6) return theme.colors.hpHigh;
  if (pct >= 0.3) return theme.colors.hpMid;
  return theme.colors.hpLow;
}

// แสดงตัวเลขให้อ่านง่าย — damage multiplier (0.25, 0.5, 1.5) ทำให้ HP เป็นทศนิยมได้
// เช่น 93.75 -> "93.8", 100 -> "100"
export function fmtNum(value: number): string {
  return String(Math.round(value * 10) / 10);
}

export function pad(str: string, length: number, char: string = " "): string {
  if (str.length >= length) return str.slice(0, length);
  return str + char.repeat(length - str.length);
}

export function center(str: string, width: number): string {
  if (str.length >= width) return str.slice(0, width);
  const totalPad = width - str.length;
  const left = Math.floor(totalPad / 2);
  const right = totalPad - left;
  return " ".repeat(left) + str + " ".repeat(right);
}

export function itemIcon(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes("POTION_ATK") || upper.includes("POTION ATK")) return theme.icons.sword;
  if (upper.includes("POTION_DEF") || upper.includes("POTION DEF")) return theme.icons.def;
  if (upper.includes("HIGH_POTION") || upper.includes("HIGH POTION")) return theme.icons.potion;
  if (upper.includes("POTION")) return theme.icons.potion;
  if (upper.includes("SMOKE")) return theme.icons.smoke;
  if (upper.includes("KEY")) return theme.icons.key;
  if (upper.includes("SWORD")) return theme.icons.sword;
  return theme.icons.bullet;
}
