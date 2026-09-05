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
|---:|
FR-01    ระบบเดิน    ผู้เล่นต้องสามารถเดินได้ ไม่ทะลุกำแพง
FR-02    สุ่มอีเวนต์    ระหว่างเดินมีโอกาสเจอ Monster, Trap, Treasure, Potion, Merchant (Shop), Nothing โดยกำหนด probability ของแต่ละแบบได้
FR-03    ระบบต่อสู้    Turn-based; Attacker เลือกได้จาก Attack/Strike/Use Item/Run, Defender เลือกได้จาก Defend/Counter/Use Item/Run
FR-04    ระบบร้านค้า    ผู้เล่นทำได้ 3 อย่าง: Buy, Sell, Leave
FR-05    ระบบ Inventory    มีของได้ไม่เกิน 8 ช่อง, ของแต่ละชิ้นนับแยก ไม่รวมกัน (ไม่ stack)
FR-06    ระบบไอเทม    มีอย่างน้อย 4 ชนิด: Potion, High Potion, Increase ATK, Increase DEF พร้อมบอกสรรพคุณและ effect ของแต่ละชิ้น
FR-07    ระบบจัดการ Game    เปลี่ยนหน้าจอ/state ได้ เช่น Explore, Combat, Shop, Inventory, Victory, Game Over
FR-08    ระบบ Player    มี stat อย่างน้อย HP, ATK, DEF
FR-09    ระบบหมอก (Fog of War)    ผู้เล่นมองเห็นได้แค่รอบตัวในรัศมีที่กำหนด, tile ที่เคยเห็นแต่พ้นระยะจะจำ layout ไว้แบบจาง
FR-10     ระบบ Mob Decide    Monster ตัดสินใจเลือก action เองได้ระหว่าง Combat
FR-11     ระบบหยุดเกม (Pause)    กด P เพื่อหยุดทุกอย่างชั่วคราว ไม่รับ key อื่นจนกว่าจะกด P ซ้ำเพื่อเล่นต่อ (แยกจาก Q ที่ใช้ Quit ออกจากเกมถาวร)
FR-12     ระบบสร้าง Dungeon    Generate แผนที่แบบ Procedural ทุกครั้งที่เริ่มเกม และต้องการันตีว่ามีเส้นทางจาก Start ไปถึง Exit ได้จริง
FR-13     ระบบปรับความยากตามระยะทาง    คำนวณระยะจากแต่ละจุดถึง Exit แล้วปรับความเก่งของ Monster ตาม (ใกล้ Exit = ยาก, ใกล้ Start = ง่าย)
FR-14     เงื่อนไขจบเกม    Victory เมื่อเดินถึง Exit, Game Over เมื่อ HP <= 0
FR-15     ระบบ Monster    มี Monster อย่างน้อย 3 ชนิด ที่มี stat/พฤติกรรมต่างกัน

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