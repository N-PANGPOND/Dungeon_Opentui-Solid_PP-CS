import { theme } from "../theme";
import type { StoryViewUIProps } from "../uiTypes";
import path from "path";
import { createSignal, createEffect, onCleanup } from "solid-js";

const eventDataPath = path.join(import.meta.dir, "../../assets/story/story.json");
const storyJsonRaw = await Bun.file(eventDataPath).json() as {
    "story" : {
        "start" : string[],
        "getWife" : string[],
        "badEndSmokeBomb" : string[],
        "useBombWithBoss" : string[]
    }
}

export const getStoryLineCount = (story: StoryViewUIProps["story"]): number =>
  storyJsonRaw.story[story].length;

const TYPE_SPEED_MS = 25;
const PULSE_TICK_MS = 40;
const PULSE_PERIOD_MS = 2400;

const PULSE_BRIGHT = theme.colors.title;
const PULSE_DIM = theme.colors.muted;

function lerpColor(hexA: string, hexB: string, t: number): string {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bch = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bch).toString(16).slice(1)}`;
}

// ── สถานะ "พิมพ์จบบรรทัดหรือยัง" ให้ tui.tsx เอาไปเช็คก่อนเลื่อนบรรทัด ──
export const [isLineTypingDone, setIsLineTypingDone] = createSignal(true);

let activeTimer: ReturnType<typeof setInterval> | null = null;
let activeFullLine = "";
let activeSetDisplayedText: ((s: string) => void) | null = null;

// เรียกจาก tui.tsx เมื่อผู้เล่นกด Enter/Space ระหว่างกำลังพิมพ์ เพื่อโชว์บรรทัดเต็มทันที
export function completeCurrentLine() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  if (activeSetDisplayedText) {
    activeSetDisplayedText(activeFullLine);
  }
  setIsLineTypingDone(true);
}

export const StoryText = (prop: StoryViewUIProps) => {
  const lines = storyJsonRaw.story[prop.story];
  const dash = "-".repeat(100)
  if (prop.story === "start") {
    lines.push(`██╗    ██╗███████╗██╗     ██╗      ██████╗ ██████╗ ███╗   ███╗███████╗    ████████╗ ██████╗     
██║    ██║██╔════╝██║     ██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝    ╚══██╔══╝██╔═══██╗    
██║ █╗ ██║█████╗  ██║     ██║     ██║     ██║   ██║██╔████╔██║█████╗         ██║   ██║   ██║    
██║███╗██║██╔══╝  ██║     ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝         ██║   ██║   ██║    
╚███╔███╔╝███████╗███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗       ██║   ╚██████╔╝    
 ╚══╝╚══╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝       ╚═╝    ╚═════╝     
                                                                                                
                ██████╗ ██╗   ██╗███╗   ██╗ ██████╗ ███████╗ ██████╗ ███╗   ██╗                 
                ██╔══██╗██║   ██║████╗  ██║██╔════╝ ██╔════╝██╔═══██╗████╗  ██║                 
                ██║  ██║██║   ██║██╔██╗ ██║██║  ███╗█████╗  ██║   ██║██╔██╗ ██║                 
                ██║  ██║██║   ██║██║╚██╗██║██║   ██║██╔══╝  ██║   ██║██║╚██╗██║                 
                ██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝███████╗╚██████╔╝██║ ╚████║                 
                ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝                 
                                                                                                
                        ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗                        
                        ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝                        
                        █████╗  ███████╗██║     ███████║██████╔╝█████╗                          
                        ██╔══╝  ╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝                          
                        ███████╗███████║╚██████╗██║  ██║██║     ███████╗                        
                        ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝                        
                                                                                                `)
  }

  const [displayedText, setDisplayedText] = createSignal("");
  const [logoColor, setLogoColor] = createSignal<string>(PULSE_DIM);

  createEffect(() => {
    const isLogoLine = prop.story === "start" && prop.lineIndex === lines.length - 1;
    const fullLine = (lines[prop.lineIndex] ?? "").normalize('NFC');

    if (isLogoLine) {
      // โลโก้: ไม่ต้องพิมพ์ทีละตัว ถือว่า "พิมพ์จบ" ทันที กด Enter ครั้งเดียวเลื่อนได้เลย
      setDisplayedText(fullLine);
      setIsLineTypingDone(true);

      const startTime = Date.now();
      const pulseTimer = setInterval(() => {
        const elapsed = (Date.now() - startTime) % PULSE_PERIOD_MS;
        const t = (Math.sin((elapsed / PULSE_PERIOD_MS) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
        setLogoColor(lerpColor(PULSE_DIM, PULSE_BRIGHT, t));
      }, PULSE_TICK_MS);

      onCleanup(() => clearInterval(pulseTimer));
      return;
    }

    // เนื้อเรื่องปกติ: ค่อยๆ พิมพ์ทีละตัวอักษร + เก็บ ref ไว้ให้ completeCurrentLine() เรียกใช้ได้
    activeFullLine = fullLine;
    activeSetDisplayedText = setDisplayedText;
    setIsLineTypingDone(false);

    let charIndex = 0;
    setDisplayedText("");
    const typeTimer = setInterval(() => {
      charIndex += 1;
      setDisplayedText(fullLine.slice(0, charIndex));
      if (charIndex >= fullLine.length) {
        clearInterval(typeTimer);
        activeTimer = null;
        setIsLineTypingDone(true);
      }
    }, TYPE_SPEED_MS);
    activeTimer = typeTimer;

    onCleanup(() => {
      if (activeTimer) {
        clearInterval(activeTimer);
        activeTimer = null;
      }
    });
  });

  const isLogoLine = () => prop.story === "start" && prop.lineIndex === lines.length - 1;

    return (
        <box
          title=" Story "
          titleColor={theme.colors.borderPanel}
          style={{
            borderStyle: theme.border.panel,
            borderColor: theme.colors.borderPanel,
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
            ><box
            style={{
                flexDirection: "column",
                width: "85%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden"
            }}>
              <text fg={theme.colors.borderPanel}>{dash}</text>
              <text fg={theme.colors.borderPanel}></text>
              <text fg={isLogoLine() ? logoColor() : theme.colors.text}>{displayedText()}</text>
              <text fg={theme.colors.borderPanel}></text>
              <text fg={theme.colors.borderPanel}>{dash}</text>
              <text fg={theme.colors.borderPanel}>[Enter / Space] Continue   |  [S] Skip</text>
            </box>
        </box>
    )
}