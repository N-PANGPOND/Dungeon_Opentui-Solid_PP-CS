// =============================================================
// DungeonView.tsx — Dungeon Map Renderer
// แสดงแผนที่ดันเจี้ยน + ตำแหน่ง Player และ Exit
// ไม่คำนวณ movement หรือ collision ใด ๆ
//
// แมพจริงใหญ่กว่ากล่อง MAP (เช่น 46x27 ช่อง แต่กล่องแสดงได้ ~40x20 ช่อง)
// จึงแสดงเป็น viewport ที่เลื่อนตามตัวผู้เล่น (camera)
// =============================================================

import { theme } from "../theme";
import { MapObject } from "../../Type-Enum/enum";
import type { DungeonViewUIProps } from "../uiTypes";
import { Show } from "solid-js";

// พื้นที่ใช้งานได้ภายในกล่อง MAP (กล่องกว้าง 82 / สูง 22 หักขอบแล้ว) 
// แต่ละช่องของแมพกว้าง 2 ตัวอักษร
const VIEW_COLS = 46; // ช่อง
const VIEW_ROWS = 27; // แถว

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ตำแหน่งมุมซ้ายบนของ viewport (หน่วย: ช่อง) ให้ player อยู่กลางจอ แต่ไม่เลยขอบแมพ
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

// แปลงส่วนของ MapObject[][] ที่อยู่ในกล้องเป็น string (แต่ละ cell = 2 char)
// ช่อง Exit วาดเป็นพื้นว่างไว้ก่อน แล้ววางไอคอนประตูทับด้วย overlay
// (ไอคอน emoji กว้าง 2 คอลัมน์พอดี แต่ถ้าสอดใน string แล้วเทอร์มินัลวัดความกว้างต่างกัน แถวนั้นจะเพี้ยน)
function formatViewport(grid: MapObject[][], cam: { x: number; y: number }): string {
  return grid
    .slice(cam.y, cam.y + VIEW_ROWS)
    .map((row) =>
      row
        .slice(cam.x, cam.x + VIEW_COLS)
        .map((cell) => (cell === MapObject.Wall ? theme.icons.wall : theme.icons.floor))
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
