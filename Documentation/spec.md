# Spec — ข้อมูลจำเพาะทางเทคนิค (Dungeon Escape)

เอกสารนี้บอกว่าระบบสร้างด้วยเครื่องมืออะไร และต้องใช้สภาพแวดล้อมแบบไหนถึงจะรันได้

---

## 1. Tech Stack

| หัวข้อ | รายละเอียด |
|---|---|
| Runtime | Bun (สร้างโปรเจกต์ด้วย `bun init` บน Bun v1.4.0) |
| ภาษา | TypeScript ^7 (lockfile: 7.0.2) — `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` |
| Interface | Console / TUI |
| TUI Framework | OpenTUI + Solid (`@opentui/solid`) เขียนหน้าจอเป็น TSX |
| Paradigm | OOP (Class + Interface) และ FP (Pure Function, Higher-order) |
| ที่เก็บข้อมูลเกม | ไฟล์ JSON (`map.json`, `event.json`, `story.json`) |
| Test framework | `bun:test` (built-in ของ Bun) |

---

## 2. Libraries / Dependencies

### Runtime dependencies (`Source-code/package.json`)

| Package | เวอร์ชัน | หน้าที่ |
|---|---|---|
| `@opentui/solid` | ^0.5.10 (lock: 0.5.10) | วาด TUI ด้วย Solid, รับ keyboard (`useKeyboard`), จัดการ renderer |
| `solid-js` | ^1.9.15 | reactive signals สำหรับอัปเดต UI (`createSignal`, `Switch/Match`, `Show`, `For`) |

`@opentui/solid` ดึง `@opentui/core` ตามมาด้วย (พร้อม native binary ของแต่ละ OS)

### Dev dependencies

| Package | เวอร์ชัน | หน้าที่ |
|---|---|---|
| `@types/bun` | latest (root: ^1.4.2) | type ของ Bun / `bun:test` |
| `typescript` | ^7 (peer) | type check (`tsc --noEmit`) |

### ไฟล์ตั้งค่าที่เกี่ยวข้อง
- `Source-code/bunfig.toml` — `preload = ["@opentui/solid/preload"]` (ให้ Bun แปลง TSX ของ Solid)
- `Source-code/tsconfig.json` — `jsx: preserve`, `jsxImportSource: @opentui/solid`
- `tsconfig.json` (root) — ใช้ตอน type check รวม Source-code และ tests

---

## 3. Environment

| หัวข้อ | ข้อกำหนด |
|---|---|
| OS | Windows (x64/arm64), Linux (x64/arm64, glibc และ musl) — ตามที่ `@opentui/core` มี native binary ให้ |
| Terminal ขนาดขั้นต่ำ | **132 คอลัมน์ × 42 แถว** (หน้าต่างเกมหลัก 132×42, หน้าจอจบเกม 120×40) ถ้าเล็กกว่านี้ภาพจะเพี้ยน |
| Font / Unicode | ต้องแสดง emoji และอักขระ block/box-drawing ได้ (🦸 🚪 💗 █ ▒ ▓ ═ ╗) |
| ภาษาไทยใน terminal | ข้อความ log ถูกแปลงเป็นอังกฤษเพื่อกันเคอร์เซอร์เพี้ยน ส่วนเนื้อเรื่อง (story) ยังเป็นภาษาไทย |
| Keyboard | ใช้คีย์บอร์ดเป็นหลัก รองรับเลย์เอาต์ไทย (เกษมณี) และ numpad |

---

## 4. การติดตั้งและรัน

```bash
# 1) ติดตั้ง Bun แล้วเข้าโฟลเดอร์โค้ด
cd Source-code

# 2) ติดตั้ง dependencies
bun install

# 3) รันเกม
bun run start        # = bun run Tui/tui.tsx
```

## 5. คำสั่งอื่นที่เกี่ยวข้อง

| คำสั่ง | ที่ | ทำอะไร |
|---|---|---|
| `bun test` | root | รันเทสทั้งหมดในโฟลเดอร์ `tests/` |
| `bun test ../tests` | `Source-code/` | รันเทสทั้งหมดจากในโฟลเดอร์โค้ด |
| `bun run test:combat` (ฯลฯ) | root | รันเทสรายโมดูล (`character`, `combat`, `console`, `dungeon`, `event`, `gameloop`, `inventory`, `item`, `monster`, `pure`, `shop`, `state`, `map`) |
| `bun run typecheck` | `Source-code/` | `tsc --noEmit -p tsconfig.json` |

> ต้องรัน `bun install` ใน `Source-code/` ก่อนเสมอ เพราะเทสบางไฟล์ (เช่น `consoleio.test.ts`) import โมดูลที่พึ่ง `@opentui/solid`

---

## 6. ไฟล์ข้อมูล (Assets)

| ไฟล์ | เนื้อหา |
|---|---|
| `assets/map/map.json` | รายการแมพ (`spawnPos`, `wifePos[]`, `exitPos`, `layout`) |
| `assets/Event/event.json` | pixel art (ตาราง 0/1) ของ event และมอนสเตอร์ (Combat: normal/elite/boss, Trap, Potion, Shop, Treasure) |
| `assets/story/story.json` | บทเรื่อง `start`, `getWife`, `badEndSmokeBomb`, `useBombWithBoss` |
