// =============================================================
// gameBridge.ts — จุดเชื่อมเดียวระหว่าง Game Logic กับ TUI
//
// กติกา: โค้ดนอกโฟลเดอร์ Tui ห้ามแก้ ดังนั้นทุกอย่างที่ UI ต้องอ่าน/แปลงจาก
// Game Logic จะอยู่ในไฟล์นี้ที่เดียว (component อื่น ๆ ไม่แตะ Game Logic เลย)
//
// ⚠ ข้อยกเว้นที่ควรรู้: GameState ยังไม่มี getter สาธารณะสำหรับ combat
//   (combatSystem / monster เป็น private) จึงอ่านผ่าน bracket access ตรงนี้
//   ถ้าวันหนึ่งเพิ่ม getter ใน GameState ให้แก้เฉพาะ 2 ฟังก์ชันด้านล่าง
//   (getCombat, getEnemyUIProps) ส่วนอื่นของ UI ไม่ต้องเปลี่ยน
// =============================================================

import type { GameState } from "../Game/State";
import type { EnemyUIProps, InventoryUIProps, PlayerUIProps, UIScreen } from "./uiTypes";

// Inventory.maxSlots เป็น private (ค่าคือ 8) — ถ้าเปลี่ยนที่ Inventory.ts ให้แก้ค่านี้ตาม
export const INVENTORY_MAX_SLOTS = 8;

// ─── Screen ────────────────────────────────────────────────────────────────

// GameState ไม่เคยตั้ง gameScreen = "VICTORY" (gameloop แค่เรียก isVictory() แล้วจบเกม)
// UI จึงต้องสรุปหน้าจอเองจากสถานะจริง ลำดับความสำคัญเหมือน GameLoop.handleInput:
// แพ้ก่อน -> ชนะ -> ตาม gameScreen ปกติ
export function resolveScreen(gs: GameState): UIScreen {
  if (gs.isGameOver() || gs.gameScreen === "GAMEOVER") return "GAMEOVER";
  if (gs.isVictory()) return "VICTORY";
  return gs.gameScreen as UIScreen;
}


// ─── Combat ────────────────────────────────────────────────────────────────

// คืน CombatSystem ปัจจุบัน เฉพาะตอนอยู่ในหน้า COMBAT จริง ๆ
// (นอก combat ตัวแปรนี้ยังค้างศัตรูของสู้ครั้งก่อนอยู่ จึงห้ามอ่าน)
function getCombat(gs: GameState) {
  if (gs.gameScreen !== "COMBAT") return null;
  return gs["combatSystem"] ?? null;
}

export function getEnemyUIProps(gs: GameState): EnemyUIProps | null {
  const combat = getCombat(gs);
  if (!combat) return null;

  const stats = combat.getMonsterStats();

  // ชนิดมอนสเตอร์ (NORMAL MONS / ELITE MONS / BOSS) ไม่มี getter — อ่านไม่ได้ก็ใช้ชื่อกลาง
  let name = "MONSTER";
  try {
    name = combat["monster"]["MonsterType"] ?? name;
  } catch {
    /* ใช้ชื่อกลางต่อไป */
  }

  return { name, hp: stats.hp, maxHp: stats.maxHp, atk: stats.atk, def: stats.def };
}

// true = ถึงตา player โจมตี (เลือก Attack/Strike/...), false = ถึงตา monster โจมตี (player เลือก Defend/Counter/...)
export function isPlayerAttackTurn(gs: GameState): boolean {
  const combat = getCombat(gs);
  return combat ? combat.isPlayerTurn() : true;
}

// ─── Input ─────────────────────────────────────────────────────────────────

// Game Logic แยก action เป็น 2 ชุดตามตา:
//   ตา player โจมตี  -> key 1-4 = Attack / Strike / Use Item / Run
//   ตา player ป้องกัน -> key 5-8 = Defend / Counter / Use Item / Run
// และจะ throw error ถ้าส่ง action ผิดชุด (ทำให้แอปล่ม)
// UI จึงแสดงเป็นปุ่ม 1-4 เสมอ แล้วแปลงเป็น 5-8 ให้เองเมื่อเป็นตาป้องกัน
//
// คืน null = ไม่ต้องส่ง key นี้ให้เกม
export function mapInputKey(key: string, screen: UIScreen, playerAttackTurn: boolean): string | null {
  if (screen !== "COMBAT") return key;

  if (/^[1-4]$/.test(key)) {
    return playerAttackTurn ? key : String(Number(key) + 4);
  }
  // 5-8 ไม่ได้แสดงใน UI — กดตรง ๆ อาจชนกับตาที่ไม่ถูกต้องจนเกม throw
  if (/^[5-8]$/.test(key)) return null;

  return key;
}
