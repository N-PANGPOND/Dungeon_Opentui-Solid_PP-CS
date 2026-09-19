// =============================================================
// DungeonView.tsx — Dungeon Map Renderer
// แสดงแผนที่ดันเจี้ยน + ตำแหน่ง Player และ Exit
// ไม่คำนวณ movement หรือ collision ใด ๆ
// =============================================================

import { theme } from "../theme";
import { MapObject } from "../../Type-Enum/enum";
import type { DungeonViewUIProps } from "../uiTypes";
import { For } from "solid-js";

// แปลง MapObject[][] เป็น string เดียว (แต่ละ cell = 2 char)
function formatGrid(grid: MapObject[][]): string {
  return grid
    .map((row) =>
      row
        .map((cell) => {
          switch (cell) {
            case MapObject.Wall:  return theme.icons.wall;   // "██"
            case MapObject.Floor: return theme.icons.floor;  // "  "
            case MapObject.Exit:  return theme.icons.exit + " "; // "🚪 "
            default:              return theme.icons.floor;
          }
        })
        .join("")
    )
    .join("\n");
}

export const DungeonView = (props: DungeonViewUIProps) => {
  const mapStr = () => formatGrid(props.grid);
  // x *2 เพราะแต่ละ cell กว้าง 2 char
  const playerLeft = () => props.playerPos.x * 2;
  const playerTop  = () => props.playerPos.y;

  return (
    <box
      title=" MAP "
      titleColor={theme.colors.borderPanel}
      style={{
        borderStyle: theme.border.panel,
        borderColor: theme.colors.borderPanel,
        flexDirection: "column",
        width: "100%",
        height: 22,
        overflow: "hidden",
      }}
    >
      <text fg={theme.colors.wall}>{mapStr()}</text>
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
