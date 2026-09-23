// =============================================================
// uiTypes.ts — UI-specific types for Dungeon TUI
// กำหนด shape ของ props ที่ component ต้องการ
// ข้อมูลจริงมาจาก Game Logic ผ่าน tui.tsx เท่านั้น
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
  wifePos: { x: number; y: number };
  isGetWife: boolean;                   
}

// ─── Shop UI Props ─────────────────────────────────────────────────────────

export interface ShopItemUI {
  index: number;
  name: string;
  description: string;
  price: number;
}

export interface ShopUIProps {
  items: ShopItemUI[];
  playerCoins: number;
}

// mirrors Type-Enum/type.ts gameScreen exactly
export type UIScreen = "DUNGEON" | "EXPLORE" | "COMBAT" | "EVENT" | "SHOP" | "INVENTORY" | "VICTORY" | "GAMEOVER" | "PAUSE";

// ─── Event Splash Screen Props ─────────────────────────────────────────────────

export interface EventScreenUIProps {
  name: string;       // ชื่อ event เช่น "⚠ TRAP!" หรือ "★ TREASURE!"
  grid: number[][];   // pixel grid 27×46 จาก event.json (0=พื้น, 1=สี)
  color: string;      // สีหลักของ event
  isChoice?: boolean; // ต้องให้ผู้เล่นกดเลือกหรือไม่
  potionName?: string; // ชื่อ potion ที่พบ
}

// ─── Combat Props ──────────────────────────────────────────────────────────

export interface CombatUIProps {
  player: PlayerUIProps;
  enemy: EnemyUIProps;
  isPlayerTurn: boolean;
  lastLog?: string;
}

// ─── Combat Action Labels ──────────────────────────────────────────────────
// Combat แบบผลัดกัน: ถึงตา player โจมตี -> ใช้ชุด "attack", ถึงตา monster โจมตี -> ใช้ชุด "defend"
// UI แสดงเป็นปุ่ม 1-4 เหมือนกันทั้งสองชุด (gameBridge แปลงเป็น key ที่ Game Logic ต้องการให้)
export type CombatPhase = "attack" | "defend";
