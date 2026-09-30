## 1. Overview
|   หัวข้อ          | รายละเอียด                     |
|-----------------|------------------------------|
| ชื่อโปรเจกต์       | Dungeon Escape               |
| วัตถุประสงค์       | นันทนาการ เเละ การทำ Project   |
| ผู้ใช้งานเป้าหมาย   | กลุ่ม CS Rmuti                  |
| ขอบเขต (Scope)  | Game Console Terminal 2D PC  |

## Objective
ผู้เล่นต้องเดินผ่าน Dungeon และหาทางออก โดยระหว่างทางสามารถเจอ Monster, Trap, Treasure, potion, High potion และ Merchant (Shop) 
โดยมีเป้าหมายหลักคือตามหาปูเป้ก่อนเดินทางไปเผชิญหน้ากับ Boss เพื่อออกจาก Dungeon

```
เนื้อเรื่อง

เอ็มและปูเป้เป็นสามีภรรยาและนักสำรวจ วันหนึ่งชาวบ้านได้มาขอร้องให้ทั้งคู่ไปสำรวจถ้ำแห่งหนึ่ง เนื่องจากผู้คนในบริเวณนั้นได้ยินเสียงปริศนาภายในถ้ำอยู่บ่อยครั้งจนไม่สามารถนอนหลับได้
เมื่อเอ็มและปูเป้เข้าไปสำรวจ พวกเขากลับพบว่าภายในถ้ำเต็มไปด้วยมอนสเตอร์และอันตรายมากมาย จนปูเป้ถูกมอนสเตอร์จับตัวไป ทำให้เอ็มต้องออกเดินทางสำรวจดันเจี้ยนเพื่อค้นหาปูเป้ 
ต่อสู้กับมอนสเตอร์ และหาทางพาทั้งคู่กลับออกจากถ้ำอย่างปลอดภัย 
** ผู้เล่นจะรับบทเป็น “เอ็ม” ** สำรวจดันเจี้ยนเพื่อช่วยเหลือ “ปูเป้” และหาทางออกจากถ้ำ โดยการจบเกมจะมีหลายรูปแบบ ขึ้นอยู่กับว่าผู้เล่นสามารถช่วยเหลือปูเป้ เอาชนะบอส และเอาตัวรอดออกจากถ้ำได้หรือไม่
```

## 2.Requirements

## 2.1 Common Requirements
ทุกโปรเจกต์ต้องมี requirement เหล่านี้เหมือนกัน

| หัวข้อ         | ข้อกำหนด                    |
|--------------|-----------------------------|
| Interface    | Console เช่น TUI             |
| Language     | TypeScript                  |
| Runtime      | Bun                         |
| OOP          | Class and Interface         |
| FP           | Pure Function, Higher-order |
| Architecture | แยก logic ออกจาก I/O        |
| Testing      | Core Logic                  |
| Persistence  | JSON file                   |
| Docs         | README + Class Diagram      |


## 2.2 Non-Functional Requirements (NFR)
| หัวข้อ            | ข้อกำหนด |
|-----------------|----------|
| Performance     | เกมดีไม่มีบัค |
| Usability       | เช่น UX ของ TUI, keyboard shortcut |
| Reliability     | เช่น error handling, validation |
| Maintainability | เช่น code style, lint rule |

## 3. Game Rules 

## 3.01 Exploration

ผู้เล่นต้องสำรวจ Dungeon และตามหา ปูเป้ ก่อนที่จะผจญภัยต่อสู้กับ Monster และ Boss ถึงจะสามารถออกจาก Dungeon  ได้สำเร็จ


Map
ใช้ Grid เช่น:

```text
██████████████
█🦸          ██ 
████████     ██
█            ██
█    ██████████
█        🚪██
█████████████
```

ความหมาย:

```text
"█"  = Wall
" "  = Floor
"🦸" = Player
"🚪" = Exit
```

### Controls

| Key | Action |
|---|---|
| `W` หรือ ⬆️ | เดินขึ้น |
| `S` หรือ ⬇️ | เดินลง |
| `A` หรือ ⬅️ | เดินซ้าย |
| `D` หรือ ➡️ | เดินขวา |
| `I` | เปิด/ปิดกระเป๋าไอเทม |
| `Q` หรือ `Esc` | ออกจากเกม |
| `U` | ใช้ไอเทมในกระเป๋า |
| `X` | ทิ้งไอเทมในกระเป๋า |
| `B` | โหมดซื้อของใน SHOP |
| `S` | โหมดขายของใน SHOP |
| `L` | ออกจาก SHOP |
| `1-8` | เลือกช่องไอเทมชิ้นที่ 1 ถึง 8 |

* ผู้เล่นไม่สามารถเดินทะลุ Wall ได้

ทุกครั้งที่ผู้เล่นเดิน ระบบจะทำงานตามลำดับ:

```text
Input  
  ↓
Validate Movement  // ตรวจสอบว่าเดินได้ไหม(ไม่ติดกำแพง)
  ↓
Move Player // ผู้เล่นขยับไปช่องใหม่
  ↓
Check Tile // ตรวจสอบว่าช่องนี้เคยสุ่ม Event ไปหรือยัง
  ↓
Random Encounter // สุ่ม Event
  ↓
Resolve Event // เล่น Event นั้นให้จบ
```

| Event | Probability (%) | ผลลัพธ์ |
| :--- | :---: | :--- |
| **Potion** | 4% | ได้ Potion |
| **Trap** | 6% | Player เสีย HP |
| **Treasure** | 7% | ได้เงิน |
| **Merchant** | 8% | เข้าสู่ Shop |
| **Monster** | 25% | เข้าสู่ Combat |
| **Nothing** | 50% | ไม่มีเหตุการณ์เกิดขึ้น |

## Event
 - Potion ได้รับ Potion, High Potion แบบสุ่มโดยสามารถเลือก Take หรือ Leave 
 - Trap เสีย 1–20 HP
 - Treasure ได้เงิน 1–150 Coin
 - Merchant เข้าสู่ระบบ Shop เพื่อใช้ Coin ซื้อไอเทมหรือขายของในกระเป๋า
 - Monster ตัดเข้าสู่ระบบ Combat เพื่อสู้กับมอนสเตอร์
 - Nothing ไม่เกิดเหตุการณ์อะไร

  * 1 ช่องจะสุ่ม event ได้ครั้งเดียวเท่านั้น
---

## 3.02 Combat

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

## 3.03 Item

ผู้เล่นสามารถพบหรือซื้อ Item ระหว่างการเล่น

Item หลักของเกม ได้แก่

| Item         | Effect                       |    
| ------------ | ---------------------------- | 
| Potion       | ฟื้น HP 25 หน่วย                |
| High Potion  | ฟื้น HP 50 หน่วย                |
| Increase ATK | เพิ่ม ATK 3 หน่วย               |
| Increase DEF | เพิ่ม DEF 2 หน่วย               |
| Smoke Bomb   | หนีจากการต่อสู้สำเร็จ 80% ต่อ 1 ลูก |

* Smoke Bomb: อยู่ในร้านค้าเท่านั้น

การใช้ Item จะทำให้ Item นั้นถูกนำออกจาก Inventory

---

## 3.04 Inventory

- ผู้เล่นสามารถเก็บ Item ได้สูงสุด **8 ช่อง**
- Item แต่ละชิ้นจะใช้ 1 ช่อง และไม่สามารถ Stack รวมกันได้

ตัวอย่าง:

```text
Slot 1 = Potion
Slot 2 = Potion
Slot 3 = High Potion
```

ในกรณีนี้ใช้พื้นที่ทั้งหมด 3 ช่อง

หาก Inventory เต็ม ผู้เล่นจะไม่สามารถรับ Item เพิ่มได้จนกว่าจะมีช่องว่าง

---

## 3.05 Shop

เมื่อผู้เล่นพบ Merchant จะสามารถเข้าสู่ Shop ได้

ผู้เล่นสามารถเลือก:

- Buy — ซื้อ Item โดยใช้ Cion
- Sell — ขาย Item ที่มีอยู่ใน Inventory เพื่อรับเงิน [ การขายจะให้เงินคืนผู้เล่น 80% จากราคา item ] 
- Leave — ออกจาก Shop และกลับเข้าสู่ Exploration

# สิ่งที่สามารถซื้อ/ขายได้ ใน Shop
| Item         | Effect                        |  Price  | Sell |
| ------------ | ----------------------------- | ------- | ---- |
| Potion       | ฟื้น HP 25 หน่วย                |   20    |  16  |
| High Potion  | ฟื้น HP 50 หน่วย                |   50    |  40   |
| Increase ATK | เพิ่ม ATK 3 หน่วย               |   90    |  72   | 
| Increase DEF | เพิ่ม DEF 2 หน่วย               |  100    |  80   | 
| Smoke Bomb   | หนีจากการต่อสู้สำเร็จ 80% ต่อ 1 ลูก |  100    |  80   | 
  
---

## 3.06 Monster Difficulty

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
| Distance to Exit | Monster Type | Difficulty Level |
| :---: | :--- | :---: |
| **0 – 2** |  **BOSS** | Extreme |
| **3 – 14** |  **ELITE MONS** | Hard |
| **15 ขึ้นไป** |  **NORMAL MONS** | Normal |

เกมใช้ **Manhattan Distance** ในการคำนวณระยะห่างระหว่างตำแหน่งของผู้เล่นกับ Exit

### Manhattan Distance Formula

```
Distance = |x1 - x2| + |y1 - y2|
```

Monster List
| ประเภทมอนสเตอร์ | HP | ATK | DEF | LUC | AGI | Coin |
| --- | --- | --- | --- | --- | --- | --- |
| NORMAL MONS | 100 | 10 | 5 | 5 | 5 | 35 |
| ELITE MONS | 200 | 30 | 20 | 5 | 5 | 110 |
| BOSS | 350 | 65 | 60 | 5 | 5 | 9999 |

 * สูตร Damage: (ATK Player − DEF Monster) × ตัวคูณ × Critical โดย Critical คือ ×2 เมื่อ LUC × 0.01 > random และถ้าผลลัพธ์ ≤ 0 จะได้ 0.1
 

# ถ้า monster เป็นฝ่าย เลือก Action ( ฝ่ายโจมตี )
|  ชื่อ มอนเตอร์    |    การโจมตี       |      การสไตรค์        |    การหลบหนี       |
| -------------  | ---------------  | ---------------      | ----------------- |
| Normal Monster | Atk Chance : 65% | Strike Chance : 25%  | Run Chance : 10%  |
| Elite Monster  | Atk Chance : 60% | Strike Chance : 37%  | Run Chance : 3%   |
| Boss Monster   | Atk Chance : 50% | Strike Chance : 50%  | Run Chance : 0%   |

# ถ้า monster เป็นฝ่าย เลือก Action ( ฝ่ายป้องกัน )
|  ชื่อ มอนเตอร์    |    การป้องกัน       |   การเคาเตอร์           |    การหลบหนี      |
| -------------  | ---------------   | ---------------       | ----------------- |
| Normal Monster | Def Chance : 50%  | Counter Chance : 30%  | Run Chance : 20%  |
| Elite Monster  | Def Chance : 40%  | Counter Chance : 40%  | Run Chance : 20%  |
| Boss Monster   | Def Chance : 50%  | Counter Chance : 50%  | Run Chance : 0%   |


---

## 3.07 Exit & Ending

หลังจากผู้เล่นช่วยเหลือปูเป้แล้ว ผู้เล่นจะต้องพาเธอเดินทางไปยังพื้นที่ของ Boss เพื่อหาทางออกจาก Dungeon
 *Smoke Bomb ถ้าใช้กับ Boss จะเป็นการได้รับฉากจบแบบที่ 4

ผลลัพธ์ของเกมมีทั้งหมด **4 รูปแบบ**

#### 1. Happy Ending — เอ็มและปูเป้รอด(Victory)

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
HAPPY ENDING (VICTORY)
```

#### 2. Bad Ending — ผู้เล่นเสียชีวิต

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

#### 3. Bad Ending — ผู้เล่นหนีกลับมาตั้งหลัก

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

## 3.08 Game Over

ผู้เล่นจะเข้าสู่ **Game Over** เมื่อ HP ลดลงจนเหลือ 0 หรือต่ำกว่า

```text
HP <= 0
   ↓
Game Over
```

เกมจะหยุดการเล่นและแสดงผล Game Over

---

## 3.09 Quit

ผู้เล่นสามารถกด `Q` หรือ `Esc` เพื่อออกจากเกม
 - การกด Quit ถือเป็นการออกจากเกม ไม่ถือเป็น Victory หรือ Game Over

## 4. Architecture

## 4.1 Project Structure
```text

my-game-project/
├── src/
│   ├── domains/               # ส่วนข้อมูลหลักและ Logic ของเกม (Domain/Entities)
│   │   ├── character/         # ระบบตัวละคร
│   │   │   ├── character.ts
│   │   │   ├── attack-type.ts  # Enum: Normal, Skill, Ult
│   │   │   └── defense-type.ts # Enum: Normal, Block, Dodge
│   │   ├── player/            # ผู้เล่นและกระเป๋าเก็บของ
│   │   │   ├── player.ts
│   │   │   └── inventory.ts
│   │   └── items/             # ไอเทมภายในเกม
│   │       ├── item.ts
│   │       └── item-factory.ts # Factory Pattern สำหรับสร้างไอเทม
│   │
│   ├── systems/               # ระบบควบคุมและกลไกหลักของเกม (Systems/Core)
│   │   ├── game-loop.ts       # คลาสหลัก GameLoop
│   │   ├── game-state.ts      # จัดการสถานะและการบันทึกเกม (GameState, FileHandler)
│   │   ├── map/               # ระบบแผนที่และการเคลื่อนที่
│   │   │   ├── map-system.ts
│   │   │   └── map-provider.ts
│   │   ├── interaction/       # ระบบการโต้ตอบในเกม
│   │   │   ├── interaction-main.ts
│   │   │   ├── event.ts       # ระบบเหตุการณ์สุ่มหรือเนื้อเรื่อง
│   │   │   └── shop.ts        # ระบบร้านค้าและการซื้อขาย
│   │   └── monsters/          # ระบบจัดการมอนสเตอร์
│   │       └── monster-factory.ts
│   │
│   ├── utils/                 # เครื่องมือช่วยเหลือทั่วไป
│   │   └── constant-type.ts   # ประเภทค่าคงที่ต่าง ๆ (เช่น ConsoleUI)
│   │
│   └── main.ts                # จุดเริ่มต้นของแอปพลิเคชัน (Entry Point)
│
├── dist/                      # โฟลเดอร์สำหรับโค้ด JavaScript ที่ Compile แล้ว
├── tests/                     # โฟลเดอร์สำหรับเขียน Unit Test แยกตามโมดูล
├── package.json               # ไฟล์จัดการ Dependencies และ Scripts ของโปรเจกต์
├── tsconfig.json              # ไฟล์ตั้งค่าสำหรับ TypeScript Compiler
└── README.md                  # เอกสารอธิบายวิธีการติดตั้งและรันโปรเจกต์


```

## 4.2
Class Diagram
<img width="8192" height="5703" alt="image" src="https://github.com/user-attachments/assets/bc8223d6-6d18-4cb1-90d0-990c339485a1" />

---

## 5. How to Run

To install dependencies:
```bash
bun install
```

To run:

```bash
เข้าในโฟลเดอร์
cd .\Source-code\

รันไฟล์
bun run start
```

## 6. How to test 
```
ทดสอบ Core Logic ด้วยคำสั่ง:

bun test

ระบบที่ควรทดสอบ ได้แก่

-Movement
-Collision
-Combat
-Damage Calculation
-Inventory
-Item Effect
-Random Event
-Monster Decision
-Monster Difficulty
-Game State

******: สรุปผลการเทสจริง เช่น จำนวน test case, coverage
```

## 7. Known Limitations

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


## Credits
| Name            | aka   | Std-id        | Main part       |
 :--- | :---: | :--- | :--- |
|1.Suteekan       | POND  | 68162110191-8 | code            |
|2.Siwakorn       | POOM  | 65162110355-0 | code            | 
|3.Peeranat       | TEN   | 68162110281-9 | test            | 
|4.Pongsatorn     | Pee   | 68162110470-9 | code            |
|5.Patsakorn      | Focus | 68162110265-3 | test            |
|6.Harirak        | TON   | 65162110472-5 | code            |
|7.Sattawat       | HART  | 68162110253-5 | Designer        |
|8.Chotirat       | CHO   | 68162110075-3 | Doc             |
|9.Apiwatthana    | Boss  | 68162110496-5 | Doc             |
|10.Siraphat      | Pun   | 68162110297-7 | Doc             |
|11.Nanphiphat    | Pump  | 67162110529-1 | Presentation Lead |
|12.Phatcharathon | Time  | 68162110290-7 | code            |
