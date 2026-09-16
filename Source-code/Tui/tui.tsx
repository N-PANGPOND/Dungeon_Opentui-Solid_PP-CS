import { render, useKeyboard, useRenderer } from "@opentui/solid"
import { useplayer } from "../shared/manager"
import { onCleanup, onMount } from "solid-js"

import path from "path"
import { soundSystem } from "../System/SoundSystem"
import { GameLoop } from "../Game/gameloop";
import { MapObject } from "../Type-Enum/enum";
import type { position,logType } from "../Type-Enum/type";
import { createSignal, For } from "solid-js"



const [log, logState] = createSignal<logType[]>([])
const gameLoop = new GameLoop((entry) => {
    logState((previousLogs) => [...previousLogs, entry])
})
gameLoop.start()

const soundDir = path.join(import.meta.dir, "../assets/sound")

soundSystem.loadManifest({
    footstep: path.join(soundDir, "footstep.mp3"),
    encounter: path.join(soundDir, "encounter.mp3"),
    attack: path.join(soundDir, "attack.mp3"),
    strike: path.join(soundDir, "strike.mp3"),
    hit: path.join(soundDir, "hit.mp3"),
    evade: path.join(soundDir, "evade.mp3"),
    victory: path.join(soundDir, "victory.mp3"),
    gameOver: path.join(soundDir, "gameover.mp3"),
    coin: path.join(soundDir, "coin.mp3"),
    potion: path.join(soundDir, "potion.mp3"),
    menuSelect: path.join(soundDir, "menuSelect.mp3"),
    menuConfirm: path.join(soundDir, "menuConfirm.mp3"),
})

const Player = gameLoop.getGameState().player
const map = gameLoop.getGameState().currentMap.getGrid()
// const { player, updatePlayerPosition } = useplayer()

const [player, playerState] = createSignal<position>(Player.getPosition())

function formatMap(map: MapObject[][]): string {
    return map.map(row => row.join('')).join('\n')
        .replaceAll(MapObject.Wall, "██")
        .replaceAll(MapObject.Floor, "  ")

}
const App = () => {
    // 3. นำไปใช้งาน
    let backGround = formatMap(map);
    const renderer = useRenderer()
    useKeyboard((key) => {
        if (key.name === "escape") {
            renderer.destroy()
        }
        const input = key.name.toLowerCase()
        gameLoop.handleInput(input)
        playerState(Player.getPosition())
    })
    

    return <box style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", width: `100%`, height: `100%` }}>
        <box style={{ borderStyle: "double", flexDirection: "column", justifyContent: "space-between", width: 120, height: 40, borderColor: "#35f306" }}>
            <box style={{ flexDirection: "row", justifyContent: "space-between", width: `100%`, height: `100%` }}>
                <box style={{ flexDirection: "column", justifyContent: "space-between", width: `80%`, height: `100%` }}>
                    <box style={{ borderStyle: "rounded", flexDirection: "row", justifyContent: "space-between", width: `100%`, height: `100%`, borderColor: "#35f306", overflow: "hidden" }}>
                        <text>{backGround}</text>
                        <text
                            position="absolute"
                            left={player().x *2}
                            top={player().y}
                        >🦸</text>
                    </box>
                    <scrollbox stickyScroll={true} stickyStart="bottom" style={{ borderStyle: "rounded", flexDirection: "row", justifyContent: "space-between", width: `100%`, height: `30%`, borderColor: "#35f306" }}>
                    {/* <scrollbox style={{ borderStyle: "rounded", flexDirection: "row", justifyContent: "space-between", width: `100%`, height: `30%`, borderColor: "#35f306" }}> */}
                        <For each={log()}>
                            {(line) => (
                            <text>
                                {line.text}
                            </text>
                          )}
                        </For>
                    </scrollbox>
                </box>
                <box style={{ flexDirection: "column", justifyContent: "space-between", width: `20%`, height: `100%` }}>
                    <box style={{ borderStyle: "rounded", flexDirection: "column", justifyContent: "space-between", width: `100%`, height: `35%`, borderColor: "#35f306" }}>
                        <text>Status:</text>
                    </box>
                    <box style={{ borderStyle: "rounded", flexDirection: "column", justifyContent: "space-between", width: `100%`, height: `35%`, borderColor: "#35f306" }}>
                        <text>Inventory:</text>
                    </box>
                    <box style={{ borderStyle: "rounded", flexDirection: "column", justifyContent: "space-between", width: `100%`, height: `30%`, borderColor: "#35f306" }}>
                        <text>Action :</text>
                        <text>  "1" : Attack
                                "2" : Strike
                                "3" : UseItem
                                "4" : Run
                                "5" : Defend
                                "6" : Counter
                                "7" : UseItem
                                "8" : Run </text>
                    </box>
                </box>
            </box>
        </box>
    </box>

}

await render(App, {
    // targetFps: 60,
    // maxFps: 60
}) 