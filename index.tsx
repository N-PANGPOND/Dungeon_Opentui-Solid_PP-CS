import { render,useKeyboard, useRenderer } from "@opentui/solid"
import { useplayer } from "./manager"
import { onCleanup, onMount } from "solid-js"



const { player: player, updatePlayerPosition } = useplayer()
let timer: NodeJS.Timeout
const App = () => {

    const renderer = useRenderer()

    useKeyboard((key) => {
      if (key.name === "escape") {
        renderer.destroy()
      }
      if (["up", "down", "left", "right","w","a","s","d"].includes(key.name)) updatePlayerPosition(key.name)
    })

    return <box style={{ borderStyle: "double",flexDirection: "column", justifyContent: "space-between",width:`100%`,height:`100%`,borderColor:"#35f306" }}> 
        <box style={{flexDirection: "row", justifyContent: "space-between",width:`100%`,height:`100%`}}>
            <box style={{borderStyle:"rounded", flexDirection: "column", justifyContent: "space-between",width:`80%`,height:`70%`,borderColor:"#35f306" }}>
                <box style={{borderStyle:"rounded", flexDirection: "row", justifyContent: "space-between",width:`80%`,height:`100%`,borderColor:"#35f306" }}>
                    <text
                        position="relative"
                        left={player().x}
                        top={player().y}
                        >🦸</text>
                </box>
                <box style={{borderStyle:"rounded", flexDirection: "row", justifyContent: "space-between",width:`100%`,height:`30%`,borderColor:"#35f306" }}>
                    <text>Controls: W/A/S/D or Arrow Keys to move, ESC to exit</text>
                </box>
            </box>
            <box style={{borderStyle:"rounded", flexDirection: "column", justifyContent: "space-between",width:`20%`,height:`100%`,borderColor:"#35f306" }}>
                <box style={{borderStyle:"rounded", flexDirection: "column", justifyContent: "space-between",width:`20%`,height:`100%`,borderColor:"#35f306" }}>
                    <text>Log:</text>
                </box>
            </box>
        </box>
    </box>
    
}

await render(App, {
    // targetFps: 60,
    // maxFps: 60
}) 