## 1. Overview
|   หัวข้อ          | รายละเอียด                     |
|-----------------|------------------------------|
| ชื่อโปรเจกต์       | Dungeon Escape               |
| วัตถุประสงค์       | นันทนาการ เเละ การทำ Project   |
| ผู้ใช้งานเป้าหมาย   | กลุ่ม CsRmuti                  |
| ขอบเขต (Scope)  | Game Console Terminal 2d PC  |

## 2.Requirements

## 2.1 Common Requirements
ทุกโปรเจกต์ต้องมี requirement เหล่านี้เหมือนกัน

| หัวข้อ         | ข้อกำหนด                    |
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

## 2.3 Functional Requirements (FR)
ระบุ feature เฉพาะของโปรเจกต์นี้

| ID   | ชื่อ Requirement | รายละเอียด |

| :--- |

| FR-01    ระบบเดิน    ผู้เล่นต้องสามารถเดินได้ ไม่ทะลุกำแพง |

| FR-02    สุ่มอีเวนต์    ระหว่างเดินมีโอกาสเจอ Monster, Trap, Treasure, Potion, Merchant (Shop), Nothing โดยกำหนด probability |ของแต่ละแบบได้

| FR-03    ระบบต่อสู้    Turn-based; Attacker เลือกได้จาก Attack/Strike/Use Item/Run, Defender เลือกได้จาก Defend/Counter/Use Item/Run |

| FR-04    ระบบร้านค้า    ผู้เล่นทำได้ 3 อย่าง: Buy, Sell, Leave |

| FR-05    ระบบ Inventory    มีของได้ไม่เกิน 8 ช่อง, ของแต่ละชิ้นนับแยก ไม่รวมกัน (ไม่ stack) |

| FR-06    ระบบไอเทม    มีอย่างน้อย 4 ชนิด: Potion, High Potion, Increase ATK, Increase DEF พร้อมบอกสรรพคุณและ effect ของแต่ละชิ้น |

| FR-07    ระบบจัดการ Game    เปลี่ยนหน้าจอ/state ได้ เช่น Explore, Combat, Shop, Inventory, Victory, Game Over |

| FR-08    ระบบ Player    มี stat อย่างน้อย HP, ATK, DEF |

| FR-09    ระบบหมอก (Fog of War)    ผู้เล่นมองเห็นได้แค่รอบตัวในรัศมีที่กำหนด, tile ที่เคยเห็นแต่พ้นระยะจะจำ layout ไว้แบบจาง |

| FR-10    ระบบ Mob Decide    Monster ตัดสินใจเลือก action เองได้ระหว่าง Combat |

| FR-11    ระบบหยุดเกม (Pause)   กด P เพื่อหยุดทุกอย่างชั่วคราว ไม่รับ key อื่นจนกว่าจะกด P ซ้ำเพื่อเล่นต่อ 
(แยกจาก Q ที่ใช้ Quit ออกจากเกมถาวร) |

| FR-13    ระบบปรับความยากตามระยะทาง    คำนวณระยะจากแต่ละจุดถึง Exit แล้วปรับความเก่งของ Monster ตาม (ใกล้ Exit = ยาก, ใกล้ Start = ง่าย)

| FR-14    เงื่อนไขจบเกม    Victory เมื่อเดินถึง Exit, Game Over เมื่อ HP <= 0 |

| FR-15    ระบบ Monster    มี Monster อย่างน้อย 3 ชนิด ที่มี stat/พฤติกรรมต่างกัน |

## 2.4 Non-Functional Requirements (NFR)
| หัวข้อ            | ข้อกำหนด |
|-----------------|----------|
| Performance     | เกมดีไม่มีบัค |
| Usability       | เช่น UX ของ TUI, keyboard shortcut |
| Reliability     | เช่น error handling, validation |
| Maintainability | เช่น code style, lint rule |

## 3. Game Rules
| :--- | :--- |
|            กฏของเกม              |  ข้อกำหนด/เงื่อนไขในการผ่าน      |
| ผู้เล่นจะต้องหาทางออกจากดันเจี้ยนให้ได้   | จะต้องผ่าน Boss ตัวสุดท้าย       |
| การได้ฉากจบ Good ending           |                              |
| การได้ฉากจบ Bad  ending           |                              |
|                                  |                              |
|                                  |                              |
|                                  |                              |
|                                  |                              |

## 4. Architecture

## 4.1 Project Structure
// โครงสร้างหลักของระบบ ที่บอกว่าระบบของเราจะถูกแบ่งเป็นส่วนประกอบ (Components) อะไรบ้าง และแต่ละส่วนจะคุยกันหรือส่งข้อมูลหากันอย่างไร

//test

```text
src/
├── gameloop/       # ส่วนควบคุม Logic และรับ Request จาก User
|  └──
├── models/         # ส่วนจัดการโครงสร้างข้อมูลและการเชื่อมต่อ Database
├── views/          # ส่วนแสดงผล UI หน้าเว็บ
└── config/         # ไฟล์ตั้งค่าระบบต่างๆ (Environment Variables)
```


## 5. How to Run
```bash
use " bun run index.tsx "
```

## 6. How to test 
```bash 
use " w a s d " to move 
use " mouse " to interact
```

## 7. Known Limitations
//หัวข้อที่ใช้อธิบายว่าระบบหรือโค้ดที่เราเขียนขึ้นมา มีอะไรบ้างที่ยังทำไม่ได้ มีขอบเขตสิ้นสุดตรงไหน หรือมีเงื่อนไขอะไรที่อาจทำให้ระบบทำงานได้ไม่เต็มที่


| ID   | ชื่อ Limitations | รายละเอียด |

| :--- |

| KL-01   |





# example

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.4.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.



|---------------------- end of 13 Sep work --------------------------|