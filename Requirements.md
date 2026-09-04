# Requirements: [Dungeon Escape]

## 1. Overview
| หัวข้อ     | รายละเอียด |
|-----------|-----------|
| ชื่อโปรเจกต์ | Dungeon Escape|
| วัตถุประสงค์ | นันทนาการ |
| ผู้ใช้งานเป้าหมาย | CsRmuti |
| ขอบเขต (Scope) | Game Console Terminal 2d |

## 2. Common Requirements
ทุกโปรเจกต์ต้องมี requirement เหล่านี้เหมือนกัน

| หัวข้อ         | ข้อกำหนด                     |
|--------------|-----------------------------|
| Interface    | Console เช่น TUI             |
| Language     | Typescript                  |
| Runtime      | Bun                         |
| OOP          | Class and Interface         |
| FP           | Pure Function, Higher-order |
| Architecture | แยก logic ออกจาก I/O        |
| Testing      | Core Logic                  |
| Persistence  | JSON file                   |
| Docs         | README + Class Diagram      |

## 3. Functional Requirements (FR)
ระบุ feature เฉพาะของโปรเจกต์นี้

| ID   | ชื่อ Requirement | รายละเอียด |
|------|-----------------|-----------|
 FR-01 | ระบบเดิน | ผู้เล่นต้องสามารถเดินได้ ไม่ทะลุกำแพง |
| FR-02 | สุ่มอีเวนต์ | ระหว่างเดินมีโอกาสเจอ:Monster , Trap , Treasure , Potion , Merchant (Shop) , Nothing |
| FR-03 | ระบบต่อสู้ | เป็นแบบ Turn base สามารถเลือก Action ได้ |
| FR-04 | ระบบร้านค้า | ผู้เล่นซื้อของ ขายของได้ |
| FR-05 | ระบบ invertory | มีของได้ไม่เกิน 8 อย่าง |
| FR-06 | ระบบไอเทม | มีบอกสรรพคุณ และ effect |
| FR-07 | ระบบจัดการgame | สามารถเปลี่ยนหน้าจอเกม gameloop |
| FR-08 | ระบบ player | มีstat |
| FR-09 | ระบบ หมอก | ผู้เล่น สามารถ มองเห็นแค่รอบตัวผุ้เล่น |
| FR-10 | ระบบ mob decide | monster ตัดสินใจ เลือก action ได้  |
| FR-11 | ระบบ หยุดเกม | สามารถหยุดทุกอย่าง และไม่รับ key อื่นๆ จนกว่าจะ กด P |

## 4. Non-Functional Requirements (NFR)
| หัวข้อ         | ข้อกำหนด |
|---------------|----------|
| Performance   | เกมดีไม่มีบัค |
| Usability     | เช่น UX ของ TUI, keyboard shortcut |
| Reliability   | เช่น error handling, validation |
| Maintainability | เช่น code style, lint rule |

## 5. Data Model
- โครงสร้างข้อมูลหลัก (Entity/Class)

## 9. Milestones (ถ้ามี)
| Phase | รายละเอียด | กำหนดเสร็จ |
|-------|-----------|------------|
| 1 | คิด Requirement | 2026-09-04 |✅
|   | ต้องรู้จัก commit github และ ต้อง Collab repo ทุกคน | 2026-09-04 |
|   | แบ่งทีม          | 2026-09-04 |
|   | ทำ class diagram | 2026-09-04 |
|   | ทำ demo ให้ผู้เล่นเดินได้ กับมี โครง tui | 2026-09-09 |