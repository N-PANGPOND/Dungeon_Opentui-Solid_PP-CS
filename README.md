## 1. Overview
|   หัวข้อ          | รายละเอียด                     |
|-----------------|------------------------------|
| ชื่อโปรเจกต์       | Dungeon Escape               |
| วัตถุประสงค์       | นันทนาการ เเละ การทำ Project   |
| ผู้ใช้งานเป้าหมาย   | กลุ่ม CS Rmuti                  |
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

| ID    | ชื่อ Requirement | รายละเอียด |
|-------|----------------|-----------|
| FR-01 |  ระบบเดิน        |   ผู้เล่นต้องสามารถเดินได้ ไม่ทะลุกำแพง |
| FR-02 |  สุ่มอีเวนต์        |   ระหว่างเดินมีโอกาสเจอ Monster, Trap, Treasure, Potion, Merchant (Shop), Nothing โดยกำหนด probability ของแต่ละแบบได้ |   
| FR-03 |  ระบบต่อสู้        |   Turn-based; Attacker เลือกได้จาก Attack/Strike/Use Item/Run, Defender เลือกได้จาก Defend/Counter/Use Item/Run |
| FR-04 |  ระบบร้านค้า      |   ผู้เล่นทำได้ 3 อย่าง: Buy, Sell, Leave |
| FR-05 |  ระบบ Inventory |   มีของได้ไม่เกิน 8 ช่อง, ของแต่ละชิ้นนับแยก ไม่รวมกัน (ไม่ stack) |
| FR-06 |  ระบบไอเทม      |   มีอย่างน้อย 4 ชนิด: Potion, High Potion, Increase ATK, Increase DEF พร้อมบอกสรรพคุณและ effect ของแต่ละชิ้น |
| FR-07 |  ระบบจัดการ Game |   เปลี่ยนหน้าจอ/state ได้ เช่น Explore, Combat, Shop, Inventory, Victory, Game Over |
| FR-08 |  ระบบ Player    |   มี stat อย่างน้อย HP, ATK, DEF |
| FR-09 |  ระบบหมอก (Fog of War) |   ผู้เล่นมองเห็นได้แค่รอบตัวในรัศมีที่กำหนด, tile ที่เคยเห็นแต่พ้นระยะจะจำ layout ไว้แบบจาง |
| FR-10 |  ระบบ Mob Decide |   Monster ตัดสินใจเลือก action เองได้ระหว่าง Combat |
| FR-11 | ระบบหยุดเกม (Pause) | กด P เพื่อหยุดทุกอย่างชั่วคราว ไม่รับ key อื่นจนกว่าจะกด P ซ้ำเพื่อเล่นต่อ (แยกจาก Q ที่ใช้ Quit ออกจากเกมถาวร) |
| FR-13 |  ระบบปรับความยากตามระยะทาง | คำนวณระยะจากแต่ละจุดถึง Exit แล้วปรับความเก่งของ Monster ตาม (ใกล้ Exit = ยาก, ใกล้ Start = ง่าย) |
| FR-14 |  เงื่อนไขจบเกม    |   Victory เมื่อเดินถึง Exit, Game Over เมื่อ HP <= 0 |
| FR-15 |  ระบบ Monster   |   มี Monster อย่างน้อย 3 ชนิด ที่มี stat/พฤติกรรมต่างกัน |

## 2.4 Non-Functional Requirements (NFR)
| หัวข้อ            | ข้อกำหนด |
|-----------------|----------|
| Performance     | เกมดีไม่มีบัค |
| Usability       | เช่น UX ของ TUI, keyboard shortcut |
| Reliability     | เช่น error handling, validation |
| Maintainability | เช่น code style, lint rule |

## 3. Game Rules 

## 3.1 Exploration

ผู้เล่นต้องจะต้องตามหาภรรยาใน Dungeon ก่อนที่จะผจญภัยต่อสู้กับ Moster และ Boss ถึงจะสามารถออกจาก Dungeon  ได้สำเร็จ

### Controls

| Key | Action |
|---|---|
| `W` | เดินขึ้น |
| `S` | เดินลง |
| `A` | เดินซ้าย |
| `D` | เดินขวา |
| `I` | เปิดกระเป๋าไอเทม |
| `Q` | ออกจากเกม |
| `P` | หยุดเกมชั่วคราว |


ผู้เล่นไม่สามารถเดินทะลุ Wall ได้

ทุกครั้งที่ผู้เล่นเดิน ระบบจะทำงานตามลำดับ:

```text
Input  
  ↓
Validate Movement  // ตรวจสอบการเดิน
  ↓
Move Player // เดินผู้เล่น
  ↓
Check Tile // ตรวจสอบ Tile
  ↓
Random Encounter // สุ่ม Event
  ↓
Resolve Event // จัดการ Event
```

เมื่อพบ Event ระบบจะดำเนินผลตามประเภทของ Event เช่น

| Event    | ผลลัพธ์             |
| -------- | -------------------|
| Monster  | เข้าสู่ Combat        |
| Trap     | Player เสีย HP      |
| Treasure | ได้เงินหรือ Item      |
| Potion   | ได้ Potion          |
| Merchant | เข้าสู่ Shop          |
| Nothing  | ไม่มีเหตุการณ์เกิดขึ้น    |

---

## 3.2 Combat

## เมื่อพบ Monster เกมจะเข้าสู่ระบบ Combat แบบ Turn-based โดย Player และ Monster จะผลัดกันเลือก Action ในแต่ละ Turn
 
 #####  Action นั้นมี 2 Phase คือ การโจมตี เเละ การป้องกัน โดยที่ ถ้า Player โจมตี Monster จะป้องกัน ถ้า Monster โจมตี Player จะป้องกัน 
 
 ##### Player จะเป็นคนเริ่ม Turn ก่อนเสมอ

ผู้เล่นสามารถเลือก Action:

เป็นฝ่ายโจมตี  
```text
Attack // โจมตีปกติ
Strike // โจมตีพิเศษ
Use Item // ใช้ไอเทม
Run // หนี
  ```
เป็นฝ่ายป้องกัน 
  ```text
Defend // ป้องกัน
Counter // สวนกลับ
Use Item // ใช้ไอเทม
Run // หนี
  ```
  #### Turn ของ Monster สามารถเลือก Action ได้ดังนี้ โดยระบบจะสุ่ม Action ตาม Probability ของ Monster แต่ละประเภท

Monster สามารถเลือก Action:

เป็นฝ่ายโจมตี
```text
Attack // โจมตีปกติ
Strike // โจมตีพิเศษ
Run // หนี
  ```
เป็นฝ่ายป้องกัน 
  ```text
Defend // ป้องกัน
Counter // สวนกลับ
Run // หนี
  ```
#### Combat จะดำเนินต่อจนกว่าฝ่ายใดฝ่ายหนึ่งจะ HP เหลือ 0 หรือผู้เล่นและมอนเตอร์สามารถ Run ได้สำเร็จ

---

## 3.3 Item

ผู้เล่นสามารถพบหรือซื้อ Item ระหว่างการเล่น

Item หลักของเกม ได้แก่

| Item         | Effect             |
| ------------ | ------------------ |
| Potion       | ฟื้น HP 25 หน่วย  |
| High Potion  | ฟื้น HP 50 หน่วย     |
| Increase ATK | เพิ่ม ATK ครั้งแรก 2 หน่วย และครั้งถัดไปเพิ่ม 5 หน่วย          |
| Increase DEF | เพิ่ม ATK ครั้งแรก 2 หน่วย และครั้งถัดไปเพิ่ม 5 หน่วย          |
| Smoke Bomb   | หนีจากการต่อสู้สำเร็จ 100% ต่อ 1 ลูก |

การใช้ Item จะทำให้ Item นั้นถูกนำออกจาก Inventory

---

## 3.4 Inventory

ผู้เล่นสามารถเก็บ Item ได้สูงสุด **8 ช่อง**

Item แต่ละชิ้นจะใช้ 1 ช่อง และไม่สามารถ Stack รวมกันได้

ตัวอย่าง:

```text
Slot 1 = Potion
Slot 2 = Potion
Slot 3 = High Potion
```

ในกรณีนี้ใช้พื้นที่ทั้งหมด 3 ช่อง

หาก Inventory เต็ม ผู้เล่นจะไม่สามารถรับ Item เพิ่มได้จนกว่าจะมีช่องว่าง

---

## 3.5 Shop

เมื่อผู้เล่นพบ Merchant จะสามารถเข้าสู่ Shop ได้

ผู้เล่นสามารถเลือก:

```text
Buy
Sell
Leave
```

**Buy**
ซื้อ Item โดยใช้เงิน

**Sell**
ขาย Item ที่มีอยู่ใน Inventory เพื่อรับเงิน

**Leave**
ออกจาก Shop และกลับเข้าสู่ Exploration

---

## 3.6 Monster Difficulty

Monster จะมีความยากแตกต่างกันตามตำแหน่งภายใน Dungeon

```text
Start
  ↓
Easy Monster
  ↓
Random Monster
  ↓
Hard Monster
  ↓
Exit
```

ห่างจาก Exit 50 ช่องขึ้นไป
→ Normal Monster

ห่างจาก Exit 20–49 ช่อง
→ Normal / Elite Monster

ห่างจาก Exit 1–19 ช่อง
→ Elite Monster

จุด Boss
→ Boss Monster

---

## 3.7 Exit & Ending

หลังจากผู้เล่นช่วยเหลือปูเป้แล้ว ผู้เล่นจะต้องพาเธอเดินทางไปยังพื้นที่ของ Boss เพื่อหาทางออกจาก Dungeon

ผลลัพธ์ของเกมมีทั้งหมด **4 รูปแบบ**

#### 1. Happy Ending — เอ็มและปูเป้รอด

ผู้เล่นสามารถเอาชนะ Boss ได้สำเร็จ และพาปูเป้ออกจาก Dungeon ได้อย่างปลอดภัย

```text
ช่วยปูเป้
   ↓
เดินทางไปหา Boss
   ↓
ชนะ Boss
   ↓
พาปูเป้ออกจาก Dungeon
   ↓
HAPPY ENDING
(VICTORY)
```

#### 2. Bad Ending — เอ็มเสียชีวิต

ผู้เล่นพ่ายแพ้ในการต่อสู้กับ Boss และเสียชีวิต ทำให้ไม่สามารถพาปูเป้ออกจาก Dungeon ได้

```text
Boss Battle
   ↓
Player HP = 0
   ↓
เอ็มเสียชีวิต
   ↓
ปูเป้เสียใจและฆ่าตัวตายตาม
   ↓
BAD ENDING
```

#### 3. Bad Ending — เอ็มหนีกลับมาตั้งหลัก

เมื่อผู้เล่นมี HP เหลือน้อย ผู้เล่นสามารถใช้ Smoke Bomb เพื่อถอยกลับมาตั้งหลักได้ แต่ปูเป้ไม่สามารถหลบหนีตามออกมาได้ทันและถูก Boss ฆ่า
 หลังจากฟื้นตัว ผู้เล่นสามารถกลับมาต่อสู้และเอาชนะ Boss ได้สำเร็จ แต่ไม่สามารถช่วยปูเป้ได้อีกแล้ว

```text
HP เหลือน้อย
   ↓
ใช้ Smoke Bomb
   ↓
เอ็มหนีออกมาได้
   ↓
ปูเป้ถูก Boss ฆ่า
   ↓
เอ็มกลับมาต่อสู้
   ↓
เอาชนะ Boss
   ↓
BAD ENDING
```

#### 4. Bad Ending — เอ็มหนีออกไปคนเดียว

ผู้เล่นใช้ Smoke Bomb เพื่อหลบหนีออกจาก Dungeon แต่ไม่สามารถพาปูเป้ออกมาด้วยได้

```text
Boss Battle
   ↓
ใช้ Smoke Bomb
   ↓
เอ็มหนีออกจาก Dungeon
   ↓
ปูเป้ออกมาไม่ได้
   ↓
BAD ENDING
```

**Victory** จะเกิดขึ้นเฉพาะ Ending ที่ 1 เมื่อผู้เล่นสามารถช่วยปูเป้ เอาชนะ Boss และพาปูเป้ออกจาก Dungeon ได้สำเร็จ

---

## 3.9 Game Over

ผู้เล่นจะเข้าสู่ **Game Over** เมื่อ HP ลดลงจนเหลือ 0 หรือต่ำกว่า

```text
HP <= 0
   ↓
Game Over
```

เกมจะหยุดการเล่นและแสดงผล Game Over

---

## 3.10 Quit

ผู้เล่นสามารถกด `Q` เพื่อออกจากเกม

ระบบสามารถถามยืนยันก่อนออก:

```text
Are you sure you want to quit? (Y/N)
```
การกด Quit ถือเป็นการออกจากเกม ไม่ถือเป็น Victory หรือ Game Over

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
```
ทดสอบ Core Logic ด้วยคำสั่ง:

bun test

ระบบที่ควรทดสอบ ได้แก่

Movement
Collision
Combat
Damage Calculation
Inventory
Item Effect
Random Event
Monster Decision
Monster Difficulty
Game State
```

## 7. Known Limitations
//หัวข้อที่ใช้อธิบายว่าระบบหรือโค้ดที่เราเขียนขึ้นมา มีอะไรบ้างที่ยังทำไม่ได้ มีขอบเขตสิ้นสุดตรงไหน หรือมีเงื่อนไขอะไรที่อาจทำให้ระบบทำงานได้ไม่เต็มที่

```
ID	ข้อจำกัด	รายละเอียด
KL-01	Console Interface	เกมทำงานผ่าน Console/TUI จึงไม่มี Graphic UI แบบเกม 2D เต็มรูปแบบ
KL-02	Keyboard Control	ระบบควบคุมหลักใช้ Keyboard
KL-03	Combat Animation	ไม่มี Animation ระหว่างการต่อสู้
KL-04	Monster AI	Monster ใช้ Rule-based Decision Logic
KL-05	Map	รูปแบบและขนาดของ Dungeon ถูกกำหนดโดย Configuration
KL-06	JSON Persistence	การบันทึกข้อมูลใช้ JSON File และมีขอบเขตตามโครงสร้างข้อมูลที่กำหนด
KL-07 Random Event	ผลของ Encounter มีความไม่แน่นอนตาม Probability
```

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
