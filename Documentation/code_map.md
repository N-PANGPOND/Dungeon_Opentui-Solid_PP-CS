# Code Map — แผนผังโค้ด (Dungeon Escape)

"ลายแทง" สำหรับคนที่เพิ่งเข้ามาอ่านโค้ด ไฟล์ไหนทำหน้าที่อะไร และถ้าจะแก้ระบบต่างๆ ต้องไปแก้ที่ไหน

---

## 1. Directory Structure

```
/                                             root ของ repo
├── documentation/                            ไฟล์เอกสาร
│   ├── GroupMember.md                        เก็บรายชื่อสมาชิกในกลุ่ม
│   └── Requirements.md                       ความต้องการของเกม
├── Source-code/                              โค้ดทั้งหมด (รัน bun ที่นี่)
│   ├── assets/
│   │   ├── Event/
│   │   │   └── event.json                    pixel art ของ อีเวนต์/มอนสเตอร์
│   │   ├── map/
│   │   │   └── map.json                      ข้อมูลแมพทั้ง 3 จุดเกิด จุดที่เมียอยู่ ทางออก
│   │   └── story/
│   │       └── story.json                    เนื้อเรื่องของเกม
│   ├── Character/
│   │   └── character.ts                      เก็บค่าพลังพื้นฐานของ ผู้เล่น/มอนสเตอร์
│   ├── ConsoleIO/
│   │   └── ConsoleIO.ts                      แปลงปุ่ม → Intent และข้อมูลเกม → UI props
│   ├── DungeonMap/
│   │   └── DungeonMap.ts                     เก็บ grid แผนที่แล้วเช็คว่าเดินได้ไหม, หาตำแหน่ง เมีย/จุดเกิด/ทางออก
│   ├── Event/
│   │   ├── Event.ts                          เหตุการณ์สุ่ม Trap / Treasure / Potion / Shop
│   │   └── Shop.ts                           ร้านค้า ซื้อ-ขาย ไอเทม
│   ├── Game/
│   │   ├── gameloop.ts                       รับ key → Intent → GameStateState.ts
│   │   └── gameState.ts                      สถานะของเกม, สุ่มอีเวนต์ทุกช่องที่เดิน, ระบบต่อสู้, เช็คแพ้/ชนะ
│   ├── Item-Inventory/
│   │   ├── Inventory.ts                      กระเป๋าของผู้เล่น เก็บไอเทมได้สูงสุด 8 ช่อง
│   │   └── Item.ts                           เก็บ ชื่อ-ราคา และเอฟเฟกต์ของไอเทม
│   ├── shared/
│   │   └── pure-function.ts                  เก็บ Pure fn - calculateDamage, getRandomAction, EvadeCheck
│   ├── System/
│   │   ├── CombatSystem.ts                   ระบบต่อสู้แบบผลัดกันรุก-รับ
│   │   └── mapSystem.ts                      สุ่มแมพจาก map.json 1 แมพ ก่อนเริ่มเกม
│   ├── tests/                                Unit Test ชื่อไฟล์ตรงกับระบบที่เทสทั้งหมด (bun test)
│   │   ├── character.test.ts
│   │   ├── combatSystem.test.ts
│   │   ├── consoleio.test.ts
│   │   ├── dungeonMap.test.ts
│   │   ├── event.test.ts
│   │   ├── gameBridge.test.ts
│   │   ├── gameloop.test.ts
│   │   ├── inventory.test.ts
│   │   ├── item.test.ts
│   │   ├── mapSystem.test.ts
│   │   ├── monster.test.ts
│   │   ├── pure-function.test.ts
│   │   ├── shop.test.ts
│   │   └── state.test.ts
│   ├── Tui/                                  UI Layer (OpenTUI + Solid)
│   │   ├── components/                       คอมโพเนนต์วาดหน้าจอ (ไม่มี game logic)
│   │   │   ├── ActionLog.tsx
│   │   │   ├── ActionPanel.tsx
│   │   │   ├── CombatView.tsx
│   │   │   ├── DungeonView.tsx
│   │   │   ├── EventSplashScreen.tsx
│   │   │   ├── GameOverScreen.tsx
│   │   │   ├── GameOverSmokeBoss.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── InventoryPanel.tsx
│   │   │   ├── InventoryView.tsx
│   │   │   ├── PlayerPanel.tsx
│   │   │   ├── ShopView.tsx
│   │   │   ├── StoryText.tsx
│   │   │   └── VictoryScreen.tsx
│   │   ├── gameBridge.ts                     จุดเชื่อมเดียวระหว่าง UI กับ Game Logic
│   │   ├── theme.ts                          สี/ไอคอน/ฟังก์ชันช่วยจัดข้อความ
│   │   ├── tui.tsx                           อีเวนต์คีย์บอร์ด/สลับหน้าจอ/เดินเรื่องสตอรี่
│   │   └── uiTypes.ts                        interface ของ props ที่ UI ใช้
│   ├── Type-Enum/
│   │   ├── enum.ts                           AttackingType, DefensiveType, MapObject, EndingType
│   │   └── type.ts                           stats, position, MonsterType, Weights, logType, Direction, gameScreen, storyType, item
│   ├── bun.lock                              ล็อกเวอร์ชัน dependency
│   ├── bunfig.toml                           รายชื่อ dependency
│   ├── package.json                          ตั้งค่า Bun
│   └── tsconfig.json                         ตั้งค่า TypeScript compiler
└── README.md                                 คู่มือแบบเต็ม มีครบทุกอย่าง
```

---

## 2. Flow ของโค้ดโดยย่อ

```
Tui/tui.tsx  ──key──▶  ConsoleIO.normalizeKeyName
                 └───▶  gameBridge.mapInputKey ──▶ GameLoop.handleInput
                                                     └─▶ parseKeyIntent ──▶ GameState (movePlayer / handleCombatAction / ...)
GameState ──ShowMessage(log)──▶ (callback) ──▶ logs ใน tui.tsx ──▶ ActionLog
tui.tsx.refresh() ──▶ ConsoleIO.getPlayerUIProps / getInventoryUIProps / getEnemyUIProps ──▶ components
```

---

## 3. How to Modify — คู่มือการปรับแก้

| ต้องการ                                        | ไปแก้ที่                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **เพิ่มมอนสเตอร์ชนิดใหม่**                     | 1. เพิ่มชนิดใน `MonsterType` (`Type-Enum/type.ts`) 2. เพิ่มสเตตัสใน `MonsterFactory.createMonster` (`Character/character.ts`) 3. เพิ่มน้ำหนัก action ใน `decideAttackingAction` / `decideDefensiveAction` 4. เพิ่มภาพใน `assets/Event/event.json` และ mapping ใน `Tui/components/CombatView.tsx` |
| **แก้ระยะที่แบ่งความยากของ Monster**           | เงื่อนไข `distToExit` ใน `MonsterFactory.createMonster`                                                                                                                                                                                                                                          |
| **แก้สมการดาเมจ / Critical**                   | `calculateDamage` ใน `shared/pure-function.ts`                                                                                                                                                                                                                                                   |
| **แก้ตัวคูณ Attack/Strike/Defend/Counter/Run** | ตาราง `multipliers` ใน `CombatSystem.processTurn`                                                                                                                                                                                                                                                |
| **แก้โอกาสหนี / Smoke Bomb**                   | `escapeChance` ใน `processTurn` และ `Math.random() < 0.8` ใน `usePlayerItem`                                                                                                                                                                                                                     |
| **แก้โอกาสเจอ event**                          | อาร์เรย์ `tileEvents` ใน `GameState.checkTileEvent` (`Game/State.ts`)                                                                                                                                                                                                                            |
| **แก้ค่า Trap / Treasure**                     | `Event/Event.ts`                                                                                                                                                                                                                                                                                 |
| **เพิ่มไอเทมใหม่**                             | 1. `Itemfactory` (`Item-Inventory/Item.ts`) 2. รายการใน constructor และ `switch` ใน `Event/Shop.ts` 3. ไอคอนใน `itemIcon` (`Tui/theme.ts`) 4. ถ้าต้องการให้เจอจาก Potion event เพิ่มใน `Event.Potion`                                                                                            |
| **แก้ราคา / % ขายคืน**                         | ราคาที่ `Itemfactory`, `0.8` ใน `Shop.sell` และ `Shop.sellItem`                                                                                                                                                                                                                                  |
| **แก้ขนาดกระเป๋า**                             | `maxSlots` ใน `Inventory.ts` (และค่าซ้ำ `INVENTORY_MAX_SLOTS` ใน `ConsoleIO.ts`, `Tui/gameBridge.ts`)                                                                                                                                                                                            |
| **แก้ค่าเริ่มต้นของ Player**                   | constructor ของ `GameState` (`Game/State.ts`)                                                                                                                                                                                                                                                    |
| **เพิ่ม/แก้แมพ**                               | `assets/map/map.json` (ตาม `MapConfig`) — ตรวจกติกาใน `DungeonMap` constructor                                                                                                                                                                                                                   |
| **แก้เนื้อเรื่อง**                             | `assets/story/story.json` (เพิ่มคีย์ใหม่ต้องเพิ่มใน `storyType` ที่ `Type-Enum/type.ts` และ `StoryText.tsx`)                                                                                                                                                                                     |
| **เพิ่มปุ่มใหม่**                              | `parseKeyIntent` (`ConsoleIO/ConsoleIO.ts`) → เพิ่ม Intent ใน `GameInputIntent` → จัดการใน `GameLoop.handleInput` และ/หรือ `useKeyboard` ใน `Tui/tui.tsx`                                                                                                                                        |
| **แก้สี / ไอคอน / ธีม**                        | `Tui/theme.ts` (ทุกคอมโพเนนต์ใช้ค่าจากที่นี่)                                                                                                                                                                                                                                                    |
| **แก้ขนาดหน้าต่าง**                            | `width/height` ของกล่องหลักใน `Tui/tui.tsx`, `VIEW_COLS/VIEW_ROWS` ใน `DungeonView.tsx`                                                                                                                                                                                                          |
| **เปลี่ยนไฟล์เสียง**                           | manifest ใน `Tui/tui.tsx` และไฟล์ใน `assets/sound/`                                                                                                                                                                                                                                              |
| **เพิ่มหน้าจอใหม่**                            | `gameScreen` (`Type-Enum/type.ts`), `UIScreen` (`Tui/uiTypes.ts`), `resolveScreen` (`Tui/gameBridge.ts`) และ `Switch/Match` ใน `Tui/tui.tsx`                                                                                                                                                     |

---

## 4. กติกาการเขียนโค้ดในโปรเจกต์

- โค้ดใน `Tui/` **ไม่แตะ Game Logic โดยตรง** — อ่านข้อมูลผ่าน `gameBridge.ts` / `ConsoleIO` เท่านั้น
- สี ไอคอน ห้ามเขียนตรงๆ ในคอมโพเนนต์ ให้ใช้ค่าจาก `Tui/theme.ts`
- ฟังก์ชันที่ต้องใช้ค่า random ให้รับค่าเข้ามาเป็นพารามิเตอร์ (เช่น `calculateDamage(..., random)`) เพื่อให้เทสได้
- เพิ่มฟีเจอร์ใหม่ต้องเพิ่มเทสใน `tests/` ของโมดูลนั้น
