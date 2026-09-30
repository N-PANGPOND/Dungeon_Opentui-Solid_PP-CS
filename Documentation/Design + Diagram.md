Game Flowchart
```
graph TD
    Start(["เริ่มเกม (new GameLoop -> start)"]) --> MapGen["สร้างแผนที่ดันเจี้ยน mapSystem.randomMaps()"]
    MapGen --> Render["วาดหน้าจอ resolveScreen() / ShowPlayer / ShowEnemy / ShowInventory"]

    Render --> Input["รอรับคำสั่งผู้เล่น handleInput(key)"]
    Input --> CheckScreen{"สถานะ gameScreen ปัจจุบัน"}

    CheckScreen -- "SHOP" --> ShopAction["จัดการร้านค้า buyFromShop() / sellToShop() / leaveShop()"]
    ShopAction --> Render

    CheckScreen -- "INVENTORY" --> InvAction["จัดการไอเทม selectSlot() / useSelectedItem() / discardSelectedItem()"]
    InvAction --> Render

    CheckScreen -- "DUNGEON" --> Move["movePlayer(direction)-> checkTileEvent()"]
    Move --> EventCheck{"ช่องที่เดินไปมีอะไร"}

    EventCheck -- "ถึงทางออก (Exit)" --> CheckEnd
    EventCheck -- "Trap" --> Trap["eventTrap(): เสีย HP"]
    Trap --> CheckEnd

    EventCheck -- "Treasure / Potion" --> Treasure["eventTreasure() / eventPotion()"]
    Treasure --> Render

    EventCheck -- "เจอมอนสเตอร์" --> CombatEvent["eventCombat() gameScreen = COMBAT"]
    CombatEvent --> Render

    EventCheck -- "พบร้านค้า" --> ShopEvent["eventShop() gameScreen = SHOP"]
    ShopEvent --> Render

    EventCheck -- "ไม่มีเหตุการณ์" --> NothingEvent["eventNothing()"]
    NothingEvent --> Render

    CheckScreen -- "COMBAT" --> CombatAction["handleCombatAction(action)-> CombatSystem.processTurn()-> calculateDamage()"]
    CombatAction --> BattleCheck{"isBattleOver() ?"}
    BattleCheck -- "ยังไม่จบ" --> Render
    BattleCheck -- "จบการต่อสู้" --> CheckEnd

    CheckEnd{"isGameOver() หรือ isVictory() ?"}
    CheckEnd -- "ยังไม่จบเกม" --> Render
    CheckEnd -- "เกมจบแล้ว" --> EndingType["แสดงหน้า GAMEOVER / VICTORY (checkEnding → GOOD_END / BAD_END)"]
    EndingType --> End(["GameLoop.end() -> จบเกม"])
```

2. Class Diagram
   
<img width="6756" height="7024" alt="image" src="https://github.com/user-attachments/assets/c07acd70-0be4-4e77-86b7-12ba23100678" />

4. Data Flow
   
flowchart LR
    Rand["Math.random() impure (อยู่ใน CombatSystem)"] --> RandIn

    subgraph IN["Input (อ่านอย่างเดียว)"]
        Source["damageSource atk, luc"]
        Target["damageTarget def"]
        Mult["multiplier"]
        RandIn["random"]
    end

    Source --> Calc
    Target --> Calc
    Mult --> Calc
    RandIn --> Calc

    Calc["calculateDamage (Pure Function)critical = luc × 0.01 &gt; random ? 2 : 1 damage = (atk − def) × multiplier × critical ถ้า damage ≤ 0 → ใช้ 0.1"] --> Out["Output { damage: number, critical: boolean }"]
    Out --> Take["processTurn() target.takeDamage(damage) แก้ HP นอกฟังก์ชัน pure"]
    
    



