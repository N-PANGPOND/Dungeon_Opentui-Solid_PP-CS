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

## เนื้อเรื่อง

เอ็มและปูเป้เป็นสามีภรรยาและนักสำรวจ วันหนึ่งชาวบ้านได้มาขอร้องให้ทั้งคู่ไปสำรวจถ้ำแห่งหนึ่ง
เนื่องจากผู้คนในบริเวณนั้นได้ยินเสียงปริศนาภายในถ้ำอยู่บ่อยครั้งจนไม่สามารถนอนหลับได้
เมื่อเอ็มและปูเป้เข้าไปสำรวจ พวกเขากลับพบว่าภายในถ้ำเต็มไปด้วยมอนเตอร์และอันตรายมากมาย
ปูเป้ถูกมอนเตอร์จับตัวไปทำให้เอ็มต้องออกเดินทางสำรวจดันเจี้ยนเพื่อค้นหาปูเป้และต่อสู้กับมอนเตอร์
และหาทางออกจากถ้ำอย่างปลอดภัย

**ผู้เล่นจะรับบทเป็น “เอ็ม”** สำรวจดันเจี้ยนเพื่อช่วยเหลือ “ปูเป้” และหาทางออกจากถ้ำ 
โดยการจบเกมจะมีหลายรูปแบบ ขึ้นอยู่กับว่าผู้เล่นสามารถช่วยเหลือปูเป้ เอาชนะบอส และเอาตัวรอดออกจากถ้ำได้หรือไม่

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
█🦸         ██ 
████████     ██
█            ██
█    ██████████
█         🚪██
██████████████
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
ระหว่างต่อสู้
| Key | Action |
| `1` | โจมตีปกติ หรือ ป้องกันปกติ ตาม Turnของผู้เล่น |
| `2` | โจมตีหนัก หรือ สวนกลับ ตาม Turnของผู้เล่น |
| `3` | เปิด/ปิดกระเป๋า เพื่อใช้ไอเทม |
| `4` | หนี จากการต่อสู้ |

** ผู้เล่นไม่สามารถเดินทะลุ Wall ได้ **

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
 - Potion : ได้รับ Potion, High Potion , Atk Potion , Def Potion แบบสุ่มโดยสามารถเลือก Take หรือ Leave 
 - Trap : เสีย 1–20 HP
 - Treasure : ได้เงิน 1–150 Coin
 - Merchant : เข้าสู่ระบบ Shop เพื่อใช้ Coin ซื้อไอเทมหรือขายของในกระเป๋า
 - Monster : เข้าสู่ระบบ Combat เพื่อสู้กับมอนสเตอร์
 - Nothing : ไม่เกิดเหตุการณ์อะไร

  ** 1 ช่องจะสุ่ม event ได้ครั้งเดียวเท่านั้น **
---

## 3.02 Combat

## เมื่อพบ Monster เกมจะเข้าสู่ระบบ Combat แบบ Turn-based โดย Player และ Monster จะผลัดกันเลือก Action ในแต่ละ Turn
 
 #####  Action นั้นมี 2 Phase คือ การโจมตี เเละ การป้องกัน โดยที่ ถ้า Player โจมตี Monster จะป้องกัน ถ้า Monster โจมตี Player จะป้องกัน 
 
 ##### Player จะเป็นคนเริ่ม Turn โจมตีก่อนเสมอ

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

** Smoke Bomb: อยู่ในร้านค้าเท่านั้น **

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

- Buy — ซื้อ Item โดยใช้ Coin
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
Normal Monster
  ↓
Elite Monster
  ↓
Boss Monster
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

 ** สูตร Damage: (ATK Player − DEF Monster) × ตัวคูณ × Critical โดย Critical จะ ×2 มีโอกาสออก 10% 
 และถ้า ดาเมจ ≤ 0 จะได้ 0.1 ตลอด **
 

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
 *Smoke Bomb ถ้าใช้กับ Boss จะเป็นการได้รับฉากจบแบบที่ 3

ผลลัพธ์ของเกมมีทั้งหมด **3 รูปแบบ**

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

#### 2. Bad Ending — ผู้เล่นใช้ Smoke Bomb ตอนสู้กับบอส กับปูเป้

เมื่อผู้เล่นมี HP เหลือน้อย ผู้เล่นสามารถใช้ Smoke Bomb เพื่อถอยกลับมาตั้งหลักได้ แต่ปูเป้ไม่สามารถหลบหนีตามออกมาได้ทันและถูก Boss ฆ่า
 หลังจากฟื้นตัว ผู้เล่นสามารถกลับมาต่อสู้และเอาชนะ Boss ได้สำเร็จ แต่ไม่สามารถช่วยปูเป้ได้อีกแล้ว

```text
ไปรับ ปูเป้
   ↓
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

#### 3. Bad Ending — ผู้เล่นใช้ Smoke Bomb ตอนสู้กับบอส คนเดียว

เมื่อผู้เล่นมี HP เหลือน้อย ผู้เล่นสามารถใช้ Smoke Bomb เพื่อถอยกลับมาตั้งหลักได้ แต่สะดุดล้มและเสียชีวิต

```text
HP เหลือน้อย
   ↓
ใช้ Smoke Bomb
   ↓
เอ็มหนีออกมาได้ และล้ม
   ↓
ถูก Boss ฆ่า
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

- Movement
- Collision
- Combat
- Damage Calculation
- Inventory
- Item Effect
- Random Event
- Monster Decision
- Monster Difficulty
- Game State

```
# สรุปผลการทดสอบ (Test Results Summary)

## สถิติการทดสอบ (Test Execution Metrics)

- **จำนวน Test Case ทั้งหมด:** 376 Cases (14 ไฟล์ทดสอบ)
- **ผ่าน (Passed):** 376 Cases (100%)
- **ไม่ผ่าน (Failed):** 0 Cases (0%)

---

## ความครอบคลุมของการทดสอบ (Test Coverage)

- **Code Coverage:** 99.18% (Line Coverage), 89.64% (Function Coverage)
- **Feature Coverage:** 100% (14 จาก 14 Functional Feature มี test ครอบคลุม ได้แก่ Character/Player, Monster, Combat, Event,
  Shop, Inventory, Item, Dungeon Map, Map System, Game Loop, Game State, Console/Input, Game Bridge และ Pure Function)

---

## สรุปรายการข้อผิดพลาดที่พบ (Defect / Bug Summary)

**จำนวน Bug ทั้งหมดที่พบ:** 9 รายการ

### แบ่งตามระดับความรุนแรง (Severity)

| ระดับความรุนแรง | จำนวน | แก้ไขแล้ว |
|---|---:|---:|
| Critical / Blocker | 0 รายการ | 0 รายการ |
| High / Major | 5 รายการ | 5 รายการ |
| Medium / Low | 4 รายการ | 4 รายการ |

**สถานะ Bug ปัจจุบัน:** แก้ไขแล้ว 9 รายการ / คงเหลือ 0 รายการ

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
