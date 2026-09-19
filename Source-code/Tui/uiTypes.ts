// =============================================================
// uiTypes.ts — UI-specific types for Dungeon TUI
// ใช้ mock data เพื่อทดสอบ UI โดยไม่ขึ้นกับ Game Logic
// =============================================================

import type { MapObject } from "../Type-Enum/enum";

// ─── Player UI Props ───────────────────────────────────────────────────────

export interface PlayerUIProps {
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  coin: number;
  position: { x: number; y: number };
}

// ─── Inventory UI Props ────────────────────────────────────────────────────

export interface InventoryItemUI {
  name: string;
  description: string;
}

export interface InventoryUIProps {
  items: InventoryItemUI[];
  maxSlots: number;
}

// ─── Enemy UI Props ────────────────────────────────────────────────────────

export interface EnemyUIProps {
  name: string;       // e.g. "NORMAL MONS" | "ELITE MONS" | "BOSS"
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
}

// ─── Dungeon View Props ────────────────────────────────────────────────────

export interface DungeonViewUIProps {
  grid: MapObject[][];
  playerPos: { x: number; y: number };
  exitPos: { x: number; y: number };
}

// ─── Game Screen ───────────────────────────────────────────────────────────
// mirrors Type-Enum/type.ts gameScreen — ใช้ import จาก type.ts จริง ๆ ใน tui.tsx

export type UIScreen = "DUNGEON" | "COMBAT" | "GAMEOVER" | "VICTORY" | "PAUSE" | "MENU";

// ─── Combat Props ──────────────────────────────────────────────────────────

export interface CombatUIProps {
  player: PlayerUIProps;
  enemy: EnemyUIProps;
  isPlayerTurn: boolean;
  lastLog?: string;
}

// ─── Mock Data (สำหรับทดสอบ UI) ────────────────────────────────────────────

export const MOCK_PLAYER: PlayerUIProps = {
  name: "HERO",
  hp: 120,
  maxHp: 160,
  atk: 30,
  def: 5,
  coin: 50,
  position: { x: 5, y: 5 },
};

export const MOCK_INVENTORY: InventoryUIProps = {
  items: [
    { name: "POTION", description: "Restores 25 HP" },
    { name: "HIGH_POTION", description: "Restores 50 HP" },
    { name: "POTION_ATK", description: "Increase ATK by 5" },
  ],
  maxSlots: 8,
};

export const MOCK_ENEMY: EnemyUIProps = {
  name: "GOBLIN",
  hp: 42,
  maxHp: 60,
  atk: 12,
  def: 3,
};
