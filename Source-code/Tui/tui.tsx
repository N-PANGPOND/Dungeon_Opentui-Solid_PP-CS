// =============================================================
// tui.tsx — Dungeon TUI Entry Point
// ประกอบ component ทั้งหมดและเชื่อมกับ Game Logic
// =============================================================

import { render, useKeyboard, useRenderer } from "@opentui/solid";
import { batch, createSignal, Match, Show, Switch } from "solid-js";
import path from "path";

import { soundSystem } from "../System/SoundSystem";
import { GameLoop } from "../Game/gameloop";

import type { logType } from "../Type-Enum/type";

// ─── UI Components ─────────────────────────────────────────────────────────
import { theme } from "./theme";
import { Header } from "./components/Header";
import { DungeonView } from "./components/DungeonView";
import { PlayerPanel } from "./components/PlayerPanel";
import { InventoryPanel } from "./components/InventoryPanel";
import { ActionPanel } from "./components/ActionPanel";
import { ActionLog, formatLogText } from "./components/ActionLog";
import { CombatView } from "./components/CombatView";
import { Footer } from "./components/Footer";
import { GameOverScreen } from "./components/GameOverScreen";
import { VictoryScreen } from "./components/VictoryScreen";
import type { PlayerUIProps, InventoryUIProps, EnemyUIProps, UIScreen } from "./uiTypes";
import {
  getPlayerUIProps,
  getInventoryUIProps,
  getEnemyUIProps,
  isPlayerAttackTurn,
  mapInputKey,
  resolveScreen,
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

// ─── Game Setup ─────────────────────────────────────────────────────────────
const [logs, setLogs] = createSignal<logType[]>([]);

const gameLoop = new GameLoop((entry: logType) => {
  setLogs((prev) => [...prev, entry]);
});
gameLoop.start();

const gameState = gameLoop.getGameState();

// ─── App Component ────────────────────────────────────────────────────────────
// การอ่านข้อมูลจาก Game Logic ทั้งหมดอยู่ใน ./gameBridge — ไฟล์นี้ทำแค่ต่อสัญญาณ UI

const App = () => {
  const renderer = useRenderer();

  // Signals ที่ UI ใช้แสดงผล
  const [player,    setPlayer]    = createSignal<PlayerUIProps>(getPlayerUIProps(gameState));
  const [inventory, setInventory] = createSignal<InventoryUIProps>(getInventoryUIProps(gameState));
  const [screen,    setScreen]    = createSignal<UIScreen>(resolveScreen(gameState));
  const [enemy,     setEnemy]     = createSignal<EnemyUIProps | null>(null);
  const [attackTurn, setAttackTurn] = createSignal<boolean>(true);
  const [map]                     = createSignal(gameState.currentMap.getGrid());
  const [exitPos]                 = createSignal(gameState.currentMap.getExitPos());

  // Refresh ข้อมูลทั้งหมดจาก Game Logic (batch = วาดใหม่ครั้งเดียว ไม่กระพริบหลายรอบ)
  function refresh() {
    batch(() => {
      setPlayer(getPlayerUIProps(gameState));
      setInventory(getInventoryUIProps(gameState));
      setScreen(resolveScreen(gameState));
      setEnemy(getEnemyUIProps(gameState));
      setAttackTurn(isPlayerAttackTurn(gameState));
    });
  }

  // Keyboard handler — ส่ง input ไปให้ Game Logic แล้ว refresh UI
  useKeyboard((key) => {
    const name = key.name.toLowerCase();

    // ESC / Q = ออกจากโปรแกรม (Q ถูก gameloop ตีความเป็น QUIT ซึ่งจะทำให้เกมหยุดแต่ UI ค้าง)
    if (name === "escape" || name === "q") {
      renderer.destroy();
      return;
    }

    // Block input บน end screens
    const s = screen();
    if (s === "GAMEOVER" || s === "VICTORY") return;

    // combat ตาป้องกันต้องส่ง action ชุดอื่น — bridge แปลงให้
    const mapped = mapInputKey(name, s, attackTurn());
    if (mapped === null) return;

    try {
      gameLoop.handleInput(mapped);
    } catch (err) {
      // Game Logic บางจุด throw (เช่น damage <= 0) — แสดงใน log แทนที่จะให้แอปล่ม
      const message = err instanceof Error ? err.message : String(err);
      setLogs((prev) => [...prev, { type: "System", text: `Game error: ${message}` }]);
    }
    refresh();
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
          <GameOverScreen player={player()} />
        </Match>
        <Match when={screen() === "VICTORY"}>
          <VictoryScreen player={player()} />
        </Match>
        <Match when={true}>
          {/* ─── Main game window ─────────────────────────────────────── */}
          <box
            style={{
              borderStyle: theme.border.outer,
              borderColor: theme.colors.borderOuter,
              flexDirection: "column",
              width: 132,
              height: 40,
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
              {/* ── Left: Map (หรือ Combat) + Log ────────────────────── */}
              <box
                style={{
                  flexDirection: "column",
                  width: 94,
                  height: 37,
                }}
              >
                <Show
                  when={screen() === "COMBAT" && enemy()}
                  fallback={
                    <DungeonView
                      grid={map()}
                      playerPos={player().position}
                      exitPos={exitPos()}
                    />
                  }
                >
                  <CombatView
                    player={player()}
                    enemy={enemy()!}
                    isPlayerTurn={attackTurn()}
                    lastLog={lastLog()}
                  />
                </Show>
                <ActionLog logs={logs()} />
              </box>

              {/* ── Right: Sidebar ────────────────────────────────────── */}
              <box
                style={{
                  flexDirection: "column",
                  width: 36,
                  height: 32,
                }}
              >
                <PlayerPanel player={player()} />
                <InventoryPanel inventory={inventory()} />
                <ActionPanel screen={screen()} isPlayerTurn={attackTurn()} />
              </box>
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
