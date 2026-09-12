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

ผู้เล่นจะต้องสำรวจ Dungeon เพื่อค้นหาเส้นทางไปยัง Exit โดยสามารถเดินได้ด้วย

```text
W = Up
A = Left
S = Down
D = Right
```

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

เมื่อพบ Monster เกมจะเข้าสู่ระบบ Combat แบบ Turn-based

ผู้เล่นสามารถเลือก Action:

```text
Attack // โจมตีปกติ
Strike // โจมตีพิเศษ
Use Item // ใช้ไอเทม
Run // หนี
```

Monster จะเลือก Action ด้วยระบบตัดสินใจของ Monster เช่น

```text
Attack // โจมตีปกติ
Defend // ป้องกัน
Counter // สวนกลับ
Run // หนี
```

Combat จะดำเนินต่อจนกว่าฝ่ายใดฝ่ายหนึ่งจะ HP เหลือ 0 หรือผู้เล่นและมอนเตอร์สามารถ Run ได้สำเร็จ

---

## 3.3 Item

ผู้เล่นสามารถพบหรือซื้อ Item ระหว่างการเล่น

Item หลักของเกม ได้แก่

| Item         | Effect             |
| ------------ | ------------------ |
| Potion       | ฟื้น HP จำนวนหนึ่ง     |
| High Potion  | ฟื้น HP จำนวนมาก     |
| Increase ATK | เพิ่มค่า ATK          |
| Increase DEF | เพิ่มค่า DEF          |
| Smoke Bomb   | ใช้ หลบหนีจากการต่อสู้ |

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

Monster ที่อยู่ใกล้ Start จะมีความแข็งแกร่งน้อยกว่า

Monster ที่อยู่ระหว่างทางจะมีความแข็งแกร่งแบบ Random

Monster ที่อยู่ใกล้ Exit จะมีความแข็งแกร่งสูงที่สุด

---

## 3.7 Exit & Ending

เมื่อผู้เล่นเดินทางมาถึง Exit เกมจะตรวจสอบสถานะของภรรยาว่าสามารถช่วยไว้ได้หรือไม่

เกมมีฉากจบ 2 รูปแบบ:

### Good Ending — ช่วยภรรยาไว้ได้

ผู้เล่นจะได้รับ **Good Ending** เมื่อสามารถช่วยภรรยาไว้ได้ก่อนเดินทางถึง Exit

```text
ช่วยภรรยาได้
    ↓
เดินทางไปถึง Exit
    ↓
Good Ending
```

ผลลัพธ์:

> ผู้เล่นสามารถช่วยภรรยาไว้ได้ และทั้งคู่สามารถหนีออกจาก Dungeon ได้สำเร็จ

### Bad Ending — ภรรยาเสียชีวิต

ผู้เล่นจะได้รับ **Bad Ending** เมื่อไม่สามารถช่วยภรรยาไว้ได้

```text
ช่วยภรรยาไม่สำเร็จ
    ↓
เดินทางไปถึง Exit
    ↓
Bad Ending
```

ผลลัพธ์:

> ผู้เล่นสามารถออกจาก Dungeon ได้ แต่ไม่สามารถช่วยภรรยาไว้ได้


---

## 3.8 Victory 

* **Good Ending (Victory):** ผู้เล่นเดินทางถึง Exit และสามารถช่วยภรรยาไว้ได้
* **Bad Ending:** ผู้เล่นเดินทางถึง Exit แต่ไม่สามารถช่วยภรรยาได้ ทำให้ภรรยาเสียชีวิต
* **Game Over:** HP ของผู้เล่นลดเหลือ 0 ก่อนที่จะเดินทางถึง Exit

เมื่อผู้เล่นเดินทางถึง Exit ระบบจะตรวจสอบสถานะของภรรยาเพื่อกำหนดผลลัพธ์ของเกม

```text
Player reaches Exit
        ↓
Check Wife Status // ตรวจสอบสถานะภรรยา
        ↓
┌───────────────────┐
│ Wife is alive?    │
└───────────────────┘
      ↓ Yes    ↓ No
      ↓          ↓
 Good Ending  Bad Ending
  (Victory)   (Wife Dies)

```

ระบบจะแสดงหน้าจอ Victory เมื่อเงื่อนไขครบถ้วน

---

## 3.9 Game Over

ผู้เล่นจะเข้าสู่ **Game Over** เมื่อ HP ลดลงจนเหลือ 0 หรือต่ำกว่า

```text
HP <= 0
   ↓
Game Over
```

เกมจะหยุดการเล่นและแสดงผลการแพ้

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
ID	ชื่อ Limitation	รายละเอียด
KL-01	Console Interface	เกมทำงานผ่าน Console / TUI จึงไม่มี Graphic UI แบบเกม 2D เต็มรูปแบบ
KL-02	Keyboard Control	ระบบควบคุมหลักใช้ Keyboard
KL-03	Combat Animation	ไม่มี Animation ระหว่างการต่อสู้
KL-04	Monster AI	Monster ใช้ Rule-based Decision Logic
KL-05	Map	รูปแบบและขนาดของ Dungeon ถูกกำหนดโดย Configuration
KL-06	JSON Persistence	การบันทึกข้อมูลใช้ JSON File และมีขอบเขตตามโครงสร้างข้อมูลที่กำหนด
KL-07	Random Event	ผลของ Encounter มีความไม่แน่นอนตาม Probability
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
