// =============================================================
// tui.tsx — Dungeon TUI Entry Point
// ประกอบ component ทั้งหมดและเชื่อมกับ Game Logic
// =============================================================

import { render, useKeyboard, useRenderer } from "@opentui/solid";
import { createSignal, For } from "solid-js";
import path from "path";

import { soundSystem } from "../System/SoundSystem";
import { GameLoop } from "../Game/gameloop";
import { MapObject } from "../Type-Enum/enum";
import type { logType } from "../Type-Enum/type";

// ─── UI Components ─────────────────────────────────────────────────────────
import { theme } from "./theme";
import { Header } from "./components/Header";
import { DungeonView } from "./components/DungeonView";
import { PlayerPanel } from "./components/PlayerPanel";
import { InventoryPanel } from "./components/InventoryPanel";
import { ActionPanel } from "./components/ActionPanel";
import { ActionLog } from "./components/ActionLog";
import { Footer } from "./components/Footer";
import type { PlayerUIProps, InventoryUIProps, UIScreen } from "./uiTypes";

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

// ─── Reactive State ──────────────────────────────────────────────────────────

// Helper — ดึงข้อมูล player จาก Game Logic ออกมาเป็น UI props
function getPlayerUIProps(): PlayerUIProps {
  const p = gameState.player;
  return {
    name:     "HERO",
    hp:       p.getHp(),
    maxHp:    p.getMaxHp(),
    atk:      p.getAtk(),
    def:      p.getDef(),
    coin:     p.getCoin(),
    position: p.getPosition(),
  };
}

// Helper — ดึง inventory จาก Game Logic
function getInventoryUIProps(): InventoryUIProps {
  const items = gameState.player.getInventory().getItems().map((item) => ({
    name:        item.item.name,
    description: item.item.description,
  }));
  return { items, maxSlots: 8 };
}

// ─── App Component ────────────────────────────────────────────────────────────

const App = () => {
  const renderer = useRenderer();

  // Signals ที่ UI ใช้แสดงผล
  const [player,    setPlayer]    = createSignal<PlayerUIProps>(getPlayerUIProps());
  const [inventory, setInventory] = createSignal<InventoryUIProps>(getInventoryUIProps());
  const [screen,    setScreen]    = createSignal<UIScreen>("DUNGEON");
  const [map]                     = createSignal(gameState.currentMap.getGrid());
  const [exitPos]                 = createSignal(gameState.currentMap.getExitPos());

  // Refresh ข้อมูลทั้งหมดจาก Game Logic
  function refresh() {
    setPlayer(getPlayerUIProps());
    setInventory(getInventoryUIProps());
    setScreen(gameState.gameScreen as UIScreen);
  }

  // Keyboard handler — ส่ง input ไปให้ Game Logic แล้ว refresh UI
  useKeyboard((key) => {
    if (key.name === "escape") {
      renderer.destroy();
      return;
    }
    gameLoop.handleInput(key.name.toLowerCase());
    refresh();
  });

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
      {/* ─── Main game window ─────────────────────────────────────────── */}
      <box
        style={{
          borderStyle: theme.border.outer,
          borderColor: theme.colors.borderOuter,
          flexDirection: "column",
          width: 120,
          height: 40,
        }}
      >
        {/* ─── Title header ─────────────────────────────────────────── */}
        <Header floor={1} screen={screen()} />

        {/* ─── Main content row ─────────────────────────────────────── */}
        <box
          style={{
            flexDirection: "row",
            width: "100%",
            height: 32,
          }}
        >
          {/* ── Left: Map + Log ──────────────────────────────────────── */}
          <box
            style={{
              flexDirection: "column",
              width: 82,
              height: 32,
            }}
          >
            <DungeonView
              grid={map()}
              playerPos={player().position}
              exitPos={exitPos()}
            />
            <ActionLog logs={logs()} />
          </box>

          {/* ── Right: Sidebar ────────────────────────────────────────── */}
          <box
            style={{
              flexDirection: "column",
              width: 36,
              height: 32,
            }}
          >
            <PlayerPanel player={player()} />
            <InventoryPanel inventory={inventory()} />
            <ActionPanel screen={screen()} />
          </box>
        </box>

        {/* ─── Footer key hints ─────────────────────────────────────── */}
        <Footer screen={screen()} />
      </box>
    </box>
  );
};

await render(App, {});
