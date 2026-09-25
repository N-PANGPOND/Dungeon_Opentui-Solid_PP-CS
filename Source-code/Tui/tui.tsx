// =============================================================
// tui.tsx — Dungeon TUI Entry Point
// ประกอบ component ทั้งหมดและเชื่อมกับ Game Logic
// =============================================================

import { render, useKeyboard, useRenderer } from "@opentui/solid";
import { batch, createSignal, Match, Show, Switch } from "solid-js";
import path from "path";

import { soundSystem } from "../System/SoundSystem";
import { GameLoop } from "../Game/gameloop";
import { ConsoleIO } from "../ConsoleIO/ConsoleIO";

import type { logType, storyType } from "../Type-Enum/type";

// ─── UI Components ─────────────────────────────────────────────────────────
import { theme } from "./theme";
import { Header } from "./components/Header";
import { DungeonView } from "./components/DungeonView";
import { PlayerPanel } from "./components/PlayerPanel";
import { InventoryPanel } from "./components/InventoryPanel";
import { InventoryView } from "./components/InventoryView";
import { ActionPanel } from "./components/ActionPanel";
import { ActionLog, formatLogText } from "./components/ActionLog";
import { CombatView } from "./components/CombatView";
import { GameOverScreen } from "./components/GameOverScreen";
import { VictoryScreen } from "./components/VictoryScreen";
import { EventSplashScreen } from "./components/EventSplashScreen";
import { ShopView } from "./components/ShopView";
import { getStoryLineCount, StoryText } from "./components/StoryText";
import type { PlayerUIProps, InventoryUIProps, EnemyUIProps, EventScreenUIProps, ShopUIProps, UIScreen } from "./uiTypes";
import {
  getEventScreenProps,
  getShopUIProps,
  isPlayerAttackTurn,
  mapInputKey,
  resolveScreen,
  getSelectedSlot,
} from "./gameBridge";

// ─── Sound Setup ────────────────────────────────────────────────────────────
const soundDir = path.join(import.meta.dir, "../assets/sound");
soundSystem.loadManifest({
  footstep:   path.join(soundDir, "footstep.mp3"),
  encounter:  path.join(soundDir, "encounter.mp3"),
  attack:     path.join(soundDir, "attack.mp3"),
  strike:     path.join(soundDir, "strike.mp3"),
  hit:        path.join(soundDir, "hit.mp3"),
  evade:      path.join(soundDir, "evade.mp3"),
  victory:    path.join(soundDir, "victory.mp3"),
  gameOver:   path.join(soundDir, "gameover.mp3"),
  coin:       path.join(soundDir, "coin.mp3"),
  potion:     path.join(soundDir, "potion.mp3"),
  menuSelect: path.join(soundDir, "menuSelect.mp3"),
  menuConfirm:path.join(soundDir, "menuConfirm.mp3"),
});


// ─── App Component ────────────────────────────────────────────────────────────
// การอ่านข้อมูลจาก Game Logic ทั้งหมดอยู่ใน ./gameBridge — ไฟล์นี้ทำแค่ต่อสัญญาณ UI

const App = () => {
  const renderer = useRenderer();
  
  // ─── Game Setup ─────────────────────────────────────────────────────────────
  const [logs, setLogs] = createSignal<logType[]>([]);
  
  const consoleIO = new ConsoleIO(
    (entry: logType) => {setLogs((prev) => [...prev, entry])}, // โยนฟังชั่นไว้ set ให้ console io ไปเรียกใช้งาน
    (entry: InventoryUIProps) => {setInventory(entry)},
    (entry: PlayerUIProps) => {setPlayer(entry)},
    (entry: EnemyUIProps) => {setEnemy(entry)}
  )
  const gameLoop = new GameLoop((log) => consoleIO.ShowMessage(log));
  gameLoop.start();
  
  const gameState = gameLoop.getGameState();

  // Signals ที่ UI ใช้แสดงผล
  const [player,    setPlayer]    = createSignal<PlayerUIProps>(consoleIO.getPlayerUIProps(gameState));
  const [inventory, setInventory] = createSignal<InventoryUIProps>(consoleIO.getInventoryUIProps(gameState));
  const [enemy,     setEnemy]     = createSignal<EnemyUIProps | null>(null);
  const [attackTurn, setAttackTurn] = createSignal<boolean>(true);
  
  const [screen,    setScreen]    = createSignal<UIScreen>(resolveScreen(gameState));
  const [shop,      setShop]      = createSignal<ShopUIProps | null>(getShopUIProps(gameState));
  const [shopMode,  setShopMode]  = createSignal<"buy" | "sell">("buy");
  const [map]                     = createSignal(gameState.currentMap.getGrid());
  const [exitPos]                 = createSignal(gameState.currentMap.getExitPos());
  const [wifePos] = createSignal(gameState.currentMap.getWifePos());
  const [rescuedWife, setRescuedWife] = createSignal(gameState.didRescueWife());
  const [selectedSlot, setSelectedSlot] = createSignal<number | null>(getSelectedSlot(gameState));
  const [story, setStory] = createSignal<storyType | null>("start");
  const [storyLineIndex, setStoryLineIndex] = createSignal(0);

  // Signal สำหรับ Event Splash Screen
  const [eventData, setEventData] = createSignal<EventScreenUIProps | null>(null);
  const [eventSecondsLeft, setEventSecondsLeft] = createSignal<number>(2);

  // ติดตาม timer เพื่อ cancel ได้ถ้าจำเป็น
  let eventTimerHandle: ReturnType<typeof setTimeout> | null = null;
  let eventTickHandle: ReturnType<typeof setInterval> | null = null;

  // Refresh ข้อมูลทั้งหมดจาก Game Logic (batch = วาดใหม่ครั้งเดียว ไม่กระพริบหลายรอบ)
  function refresh() {
    batch(() => {
      setSelectedSlot(getSelectedSlot(gameState));
      consoleIO.ShowPlayer(gameState);
      consoleIO.ShowInventory(gameState);
      consoleIO.ShowEnemy(gameState);
      setShop(getShopUIProps(gameState));
      
      setScreen(resolveScreen(gameState));
      
      setAttackTurn(isPlayerAttackTurn(gameState));
      setRescuedWife(gameState.didRescueWife());
    });
  }

  // เริ่ม event splash screen + countdown timer (เฉพาะ event ทั่วไป)
  function triggerEventSplash(ev: EventScreenUIProps) {
    // cancel timer เดิมถ้ามีอยู่
    if (eventTimerHandle !== null) clearTimeout(eventTimerHandle);
    if (eventTickHandle !== null)  clearInterval(eventTickHandle);

    setEventData(ev);
    setEventSecondsLeft(2);

    // ถ้าเป็น Event ที่ให้เลือก (เช่น Potion) -> ไม่นับถอยหลัง ให้รอผู้เล่นกด 1 หรือ 2
    if (ev.isChoice) {
      return;
    }

    // countdown tick ทุก 1 วินาที
    eventTickHandle = setInterval(() => {
      setEventSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    // หลัง 3 วิ → clear pendingEvent + กลับสู่หน้าจอปกติ
    eventTimerHandle = setTimeout(() => {
      if (eventTickHandle !== null) clearInterval(eventTickHandle);
      gameState.clearPendingEvent();
      setEventData(null);
      refresh();
    }, 2000);
  }

  // Keyboard handler — ส่ง input ไปให้ Game Logic แล้ว refresh UI
  useKeyboard((key) => {
    const name = key.name.toLowerCase();
    
    // ESC / Q = ออกจากโปรแกรม (Q ถูก gameloop ตีความเป็น QUIT ซึ่งจะทำให้เกมหยุดแต่ UI ค้าง)
    if (name === "q") {
      renderer.destroy();
      return;
    }

    if (story() !== null) {
      if (name !== "enter" && name !== "space" && name !== "return" && name !== " ") {
        return;
      }

      if (storyLineIndex() >= getStoryLineCount(story()!) - 1) {
        setStory(null);
        setStoryLineIndex(0);
      } else {
        setStoryLineIndex((index) => index + 1);
      }
      return;
    }

    // Block input บน end screens (ยกเว้น ESC ที่ใช้ออกจากโปรแกรม)
    const s = screen();
      if (s === "GAMEOVER" || s === "VICTORY") {
        if (name === "escape") {
          renderer.destroy();
     }
      return;
    }

    // จัดการ input ในหน้า SHOP
    if (s === "SHOP") {
      if (name === "l" || name === "escape") {
        gameState.leaveShop();
        refresh();
        return;
      }
      if (name === "s") {
        setShopMode("sell");
        return;
      }
      if (name === "b") {
        setShopMode("buy");
        return;
      }
      if (/^[1-8]$/.test(name)) {
        const num = parseInt(name, 10);
        if (shopMode() === "buy") {
          if (num >= 1 && num <= 5) {
            gameState.buyFromShop(num - 1);
            refresh();
          }
        } else {
          gameState.sellToShop(num - 1);
          refresh();
        }
        return;
      }
      return;
    }

    // จัดการ input ในหน้า EVENT (ถ้าเป็น Potion Choice ให้กด 1=เก็บ, 2=ไม่เก็บ)
    if (s === "EVENT") {
      const ev = eventData();
      if (ev?.isChoice) {
        if (name === "1" || name === "y" || name === "enter") {
          gameState.takePotion();
          setEventData(null);
          refresh();
          return;
        }
        if (name === "2" || name === "n" || name === "escape") {
          gameState.leavePotion();
          setEventData(null);
          refresh();
          return;
        }
      } else {
        if (name === "space" || name === "enter" || name === "return" || name === " " || name === "e") {
          if (eventTimerHandle !== null) clearTimeout(eventTimerHandle);
          if (eventTickHandle !== null) clearInterval(eventTickHandle);
          gameState.clearPendingEvent();
          setEventData(null);
          refresh();
          return;
        }
      }
      return;
    }

    if (name === "escape") {
      renderer.destroy();
      return;
    }

    // combat ตาป้องกันต้องส่ง action ชุดอื่น — bridge แปลงให้
    const mapped = mapInputKey(name, s, attackTurn());
    if (mapped === null) return;

    const prevTurn = attackTurn();
    const prevScreen = screen();

    try {
      gameLoop.handleInput(mapped);
    } catch (err) {
      // Game Logic บางจุด throw (เช่น damage <= 0) — แสดงใน log แทนที่จะให้แอปล่ม
      const message = err instanceof Error ? err.message : String(err);
      setLogs((prev) => [...prev, { type: "System", text: `Game error: ${message}` }]);
    }

    // ตรวจสอบว่ามี pendingEvent ใหม่หรือไม่ (เกิดจาก event ที่เพิ่งเกิดขึ้น)
    const newEventData = getEventScreenProps(gameState);
    if (newEventData !== null) {
      refresh(); // update screen เป็น "EVENT" ก่อน
      triggerEventSplash(newEventData);
    } else {
      refresh();
    }

    // แจ้งเตือนรอบเทิร์นลงใน LOG เมื่ออยู่ในหน้า COMBAT
    if (screen() === "COMBAT") {
      const curTurn = attackTurn();
      if (prevScreen !== "COMBAT") {
        setLogs((prev) => [...prev, {
          type: "System",
          text: curTurn ? "▶ YOUR TURN (Choose 1-4 to Attack)" : "▶ MONSTER'S TURN (Choose 1-4 to Defend)",
        }]);
      } else if (prevTurn !== curTurn) {
        if (curTurn) {
          setLogs((prev) => [...prev, { type: "System", text: "▶ YOUR TURN (Choose 1-4 to Attack)" }]);
        } else {
          setLogs((prev) => [...prev, { type: "System", text: "▶ MONSTER'S TURN (Choose 1-4 to Defend)" }]);
        }
      }
    }
  });

  const lastLog = () => {
    const all = logs();
    const last = all[all.length - 1];
    return last ? formatLogText(last.text) : undefined;
  };

  return (
    // ─── Outer centering wrapper ──────────────────────────────────────
    <box
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {/* ─── End screens (full-window, replaces entire layout) ─────────
          ต้องใช้ Switch/Match — component ของ Solid รันครั้งเดียว
          `if (screen() === ...) return` จะเช็กแค่ตอนสร้างและไม่อัปเดตตามภายหลัง */}
      <Switch>
        <Match when={screen() === "GAMEOVER"}>
          <GameOverScreen player={player()!} />
        </Match>
        <Match when={screen() === "VICTORY"}>
          <VictoryScreen player={player()!} rescuedWife={rescuedWife()} />
        </Match>
        <Match when={true}>
          {/* ─── Main game window ─────────────────────────────────────── */}
          <box
            style={{
              borderStyle: theme.border.outer,
              borderColor: theme.colors.borderOuter,
              flexDirection: "column",
              width: 132,
              height: 42,
            }}
          >
            {/* ─── Title header ─────────────────────────────────────── */}
            <Header screen={screen()} isPlayerTurn={attackTurn()} />

            {/* ─── Main content row ─────────────────────────────────── */}
            <box
              style={{
                flexDirection: "row",
                width: "100%",
                height: 37,
              }}
            >
              <Show when={story() !== null}>
                <StoryText
                  story={story()!}
                  lineIndex={storyLineIndex()}
                  onComplete={() => {
                    setStory(null);
                    setStoryLineIndex(0);
                  }}
                />
              </Show>

              {/* ── Left: Map (หรือ Event / Combat) + Log ────────────────────── */}
              <Show when={story() === null}>
              <box
                style={{
                  flexDirection: "column",
                  width: 94,
                  height: 37,
                }}
              >
                <Switch>
                  <Match when={screen() === "EVENT" && eventData() !== null}>
                    <EventSplashScreen
                      name={eventData()!.name}
                      grid={eventData()!.grid}
                      color={eventData()!.color}
                      isChoice={eventData()!.isChoice}
                      potionName={eventData()!.potionName}
                      secondsLeft={eventSecondsLeft()}
                    />
                  </Match>
                  <Match when={screen() === "SHOP" && shop() !== null}>
                    <ShopView
                      shop={shop()!}
                      inventory={inventory()!}
                      mode={shopMode()}
                    />
                  </Match>
                  <Match when={screen() === "COMBAT" && enemy()}>
                    <CombatView
                      player={player()}
                      enemy={enemy()!}
                      isPlayerTurn={attackTurn()}
                      lastLog={lastLog()}
                    />
                  </Match>
                  <Match when={screen() === "INVENTORY"}>
                    <InventoryView items={inventory().items} maxSlots={inventory().maxSlots} selectedSlot={selectedSlot()} />
                  </Match>
                  <Match when={true}>
                    <DungeonView
                      grid={map()}
                      playerPos={player()!.position}
                      exitPos={exitPos()}
                      wifePos={wifePos()}          
                      isGetWife={rescuedWife()}
                    />
                  </Match>
                </Switch>
                <ActionLog logs={logs()} />
              </box>

              {/* ── Right: Sidebar ────────────────────────────────────── */}
              <box
                style={{
                  flexDirection: "column",
                  width: 36,
                  height: 37,
                }}
              >
                <PlayerPanel player={player()} />
                <InventoryPanel inventory={inventory()} />
                <ActionPanel
                  screen={screen()}
                  isPlayerTurn={attackTurn()}
                  isEventChoice={eventData()?.isChoice ?? false}
                />
              </box>
              </Show>
            </box>

            {/* ─── Footer key hints ─────────────────────────────────── */}
            {/* <Footer screen={screen()} isPlayerTurn={attackTurn()} /> */}
          </box>
        </Match>
      </Switch>
    </box>
  );
};

await render(App, {});
