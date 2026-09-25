import { theme } from "../theme";
import type { StoryViewUIProps } from "../uiTypes";
import path from "path";

const eventDataPath = path.join(import.meta.dir, "../../assets/story/story.json");
const storyJsonRaw = await Bun.file(eventDataPath).json() as {
    "story" : {
        "start" : string[],
        "getWife" : string[],
        "happyEnd" : string[],
        "badEndSmokeBomb" : string[],
        "useBombWithBoss" : string[]
    }
}

export const getStoryLineCount = (story: StoryViewUIProps["story"]): number =>
  storyJsonRaw.story[story].length;


export const StoryText = (prop:StoryViewUIProps) => {
  const lines = storyJsonRaw.story[prop.story];

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
        >
          <text>{lines[prop.lineIndex] ?? ""}</text>
          <text fg={theme.colors.borderPanel}>[Enter / Space] Continue</text>
        </box>
    )
}