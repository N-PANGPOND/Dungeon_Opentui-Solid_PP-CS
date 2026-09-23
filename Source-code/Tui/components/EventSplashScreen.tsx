// =============================================================
// EventSplashScreen.tsx — Event Pixel Art Splash Screen
// แสดงภาพ Pixel Art ประจำอีเวนต์ในช่องแมพ
// สำหรับ Potion (Choice): แสดงภาพขวดยาเต็มตัว และรอรับ input จากแถบ CONTROLS
// สำหรับ Event อื่น: แสดงภาพพร้อมแถบนับเวลาถอยหลัง 3 วินาที
// =============================================================

import { theme } from "../theme";
import type { EventScreenUIProps } from "../uiTypes";
import { Show } from "solid-js";

interface EventSplashScreenProps extends EventScreenUIProps {
  secondsLeft: number;  // เวลาถอยหลัง (3, 2, 1) สำหรับแสดง countdown
}

const VIEW_COLS = 46;
const VIEW_ROWS = 27;

export const EventSplashScreen = (props: EventSplashScreenProps) => {
  const mapStr = () =>
    props.grid
      .slice(0, VIEW_ROWS)
      .map((row) =>
        row
          .slice(0, VIEW_COLS)
          .map((cell) => (cell === 1 ? "██" : "  "))
          .join("")
      )
      .join("\n");

  const countdownText = () =>
    `[${"█".repeat(props.secondsLeft * 8)}${"░".repeat(24 - props.secondsLeft * 8)}] ${props.secondsLeft}s`;

  return (
    <box
      title={` ${props.name} `}
      titleColor={props.color}
      style={{
        borderStyle: theme.border.panel,
        borderColor: props.color,
        flexDirection: "column",
        width: "100%",
        height: 29,
        overflow: "hidden",
      }}
    >
      {/* Pixel Art Grid (27 rows x 46 cols = 92 chars width) */}
      <text fg={props.color}>{mapStr()}</text>

      {/* Countdown overlay — แสดงเฉพาะเมื่อไม่ใช่ Choice event */}
      <Show when={!props.isChoice}>
        <text
          position="absolute"
          left={62}
          top={25}
          fg={props.color}
        >
          {countdownText()}
        </text>
      </Show>
    </box>
  );
};
