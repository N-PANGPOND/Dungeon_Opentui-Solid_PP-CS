// =============================================================
// DungeonView.tsx — Dungeon Map Renderer
// แสดงแผนที่ดันเจี้ยน + ตำแหน่ง Player และ Exit
// ไม่คำนวณ movement หรือ collision ใด ๆ
//
// แมพจริงขนาด 46x27 ช่อง พอดีกับกล่อง MAP (VIEW_COLS=46, VIEW_ROWS=27)
// =============================================================

import { theme } from "../theme";
import { MapObject } from "../../Type-Enum/enum";
import type { DungeonViewUIProps } from "../uiTypes";
import { Show } from "solid-js";

// พื้นที่ใช้งานได้ภายในกล่อง MAP (กล่องกว้าง 94 หักขอบ 2 ข้าง = 92 chars / สูง 29 หักขอบ = 27 บรรทัด)
// แต่ละช่องของแมพกว้าง 2 ตัวอักษร (46 * 2 = 92)
const VIEW_COLS = 46; // ช่อง
const VIEW_ROWS = 27; // แถว

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ตำแหน่งมุมซ้ายบนของ viewport
function cameraOrigin(
  grid: MapObject[][],
  player: { x: number; y: number }
): { x: number; y: number } {
  const mapH = grid.length;
  const mapW = grid[0]?.length ?? 0;
  return {
    x: clamp(player.x - Math.floor(VIEW_COLS / 2), 0, Math.max(0, mapW - VIEW_COLS)),
    y: clamp(player.y - Math.floor(VIEW_ROWS / 2), 0, Math.max(0, mapH - VIEW_ROWS)),
  };
}

// แปลงส่วนของ MapObject[][] เป็น string (แต่ละ cell = 2 char)
function formatViewport(grid: MapObject[][], cam: { x: number; y: number }): string {
  return grid
    .slice(cam.y, cam.y + VIEW_ROWS)
    .map((row) =>
      row
        .slice(cam.x, cam.x + VIEW_COLS)
        .map((cell) => (cell === MapObject.Wall ? theme.icons.wall[Math.floor(Math.random() * theme.icons.wall.length)] : theme.icons.floor))
        .join("")
    )
    .join("\n");
}

export const DungeonView = (props: DungeonViewUIProps) => {
  const cam = () => cameraOrigin(props.grid, props.playerPos);
  const mapStr = () => formatViewport(props.grid, cam());

  // ตำแหน่งบนจอ = (ตำแหน่งในแมพ - ตำแหน่งกล้อง) — x คูณ 2 เพราะแต่ละ cell กว้าง 2 char
  const playerLeft = () => (props.playerPos.x - cam().x) * 2;
  const playerTop  = () => props.playerPos.y - cam().y;

  const exitCol = () => props.exitPos.x - cam().x;
  const exitRow = () => props.exitPos.y - cam().y;
  const exitVisible = () =>
    exitCol() >= 0 && exitCol() < VIEW_COLS && exitRow() >= 0 && exitRow() < VIEW_ROWS;

  const wifeCol = () => props.wifePos.x - cam().x;
  const wifeRow = () => props.wifePos.y - cam().y;
  const wifeVisible = () =>
    !props.isGetWife &&   // ช่วยแล้วให้ซ่อน ไม่โชว์ซ้ำ
    wifeCol() >= 0 && wifeCol() < VIEW_COLS && wifeRow() >= 0 && wifeRow() < VIEW_ROWS;

  return (
    <box
      title=" MAP "
      titleColor={theme.colors.borderPanel}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.borderPanel,
        flexDirection: "column",
        width: "100%",
        height: 29,
        overflow: "hidden",
      }}
    >
      <text fg={theme.colors.wall}>{mapStr()}</text>

      {/* Exit overlay — วาดก่อน player เพื่อให้ player ทับได้ */}
      <Show when={exitVisible()}>
        <text
          position="absolute"
          left={exitCol() * 2}
          top={exitRow()}
          fg={theme.colors.exit}
        >
          {theme.icons.exit}
        </text>
      </Show>

      <Show when={wifeVisible()}>
        <text position="absolute" left={wifeCol() * 2} top={wifeRow()} fg={theme.colors.wife}>
          {theme.icons.wife}
        </text>
      </Show>

      {/* Player overlay — absolute positioning บน map */}
      <text
        position="absolute"
        left={playerLeft()}
        top={playerTop()}
        fg={theme.colors.primary}
      >
        {theme.icons.player}
      </text>
    </box>
  );
};
