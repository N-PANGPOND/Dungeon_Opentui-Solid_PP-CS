import { render,useKeyboard, useRenderer } from "@opentui/solid"
import { useplayer } from "./manager"
import { onCleanup, onMount } from "solid-js"
// import sound from "sound-play";
// import path from "path";

// ระบุที่อยู่ไฟล์เสียงให้ถูกต้อง
// const soundPath = path.join(process.cwd(), "alert.mp3");

function test() {
    const renderer = useRenderer()
    useKeyboard((key) => {
      if (key.name === "escape") {
        renderer.destroy()
      }
      if (["up", "down", "left", "right","w","a","s","d"].includes(key.name)) updatePlayerPosition(key.name)
    })

}
const { player: player, updatePlayerPosition } = useplayer()
const App = () => {

let x = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [0,0,0,1,1,1,0,0,0,0,1,1,1,0,1,1,0,0,1,1,0,0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,0,1,1,0,0,0,1,1,1,1],
    [0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,1,0,0,0,1,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,1],
    [0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,1,1,1,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,1,0,1,0,0,1,1,0,0,0,0,1,1,1,0,0,0,1,1,1,0,1],
    [0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
    [0,1,1,1,1,0,1,1,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,0,0,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,1,1,1,0,1],
    [0,1,1,1,1,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,1],
    [0,1,1,1,1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,0,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,0],
    [0,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,1,1,1,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,1],
    [0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,1],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,0,0,0,1,0,0,0,0,1,1,1,0,1,1,1],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1],
    [0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [0,0,0,0,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,0,1,0,1],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0,1,1,0,1,1,1,0,1,1,1],
    [0,0,0,0,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

];
function formatMap(mapString: number[][]): string {
    return mapString.map(row => row.join('')).join('\n')
        .replaceAll("0", "██")  // เปลี่ยนขอบนอกเป็นกำแพง
        .replaceAll("1", "  ")  // เปลี่ยนกำแพงด้านใน

}
// 3. นำไปใช้งาน
let backGround = formatMap(x);
// backGround = x.map(row => row.join('')).join('\n');
    test()
    

    return <box style={{ flexDirection: "column", justifyContent: "center",alignItems: "center",width:`100%`,height:`100%` }}> 
        <box style={{ borderStyle: "double",flexDirection: "column", justifyContent: "space-between",width:120,height:40,borderColor:"#35f306" }}> 
            <box style={{flexDirection: "row", justifyContent: "space-between",width:`100%`,height:`100%`}}>
                <box style={{ flexDirection: "column", justifyContent: "space-between",width:`80%`,height:`100%` }}>
                    <box style={{borderStyle:"rounded", flexDirection: "row", justifyContent: "space-between",width:`100%`,height:`100%`,borderColor:"#35f306",overflow: "hidden" }}>
                        <text>{backGround}</text>
                        <text
                            position="absolute"
                            left={player().x}
                            top={player().y}
                            >🦸</text>
                    </box>
                    <box style={{borderStyle:"rounded", flexDirection: "row", justifyContent: "space-between",width:`100%`,height:`30%`,borderColor:"#35f306" }}>
                        <text>Controls: W/A/S/D or Arrow Keys to move, ESC to exit</text>
                    </box>
                </box>
                <box style={{flexDirection: "column", justifyContent: "space-between",width:`20%`,height:`100%` }}>
                    <box style={{borderStyle:"rounded", flexDirection: "column", justifyContent: "space-between",width:`100%`,height:`35%`,borderColor:"#35f306" }}>
                        <text>Status:</text>
                    </box>
                    <box style={{borderStyle:"rounded", flexDirection: "column", justifyContent: "space-between",width:`100%`,height:`35%`,borderColor:"#35f306" }}>
                        <text>Inventory:</text>
                    </box>
                    <box style={{borderStyle:"rounded", flexDirection: "column", justifyContent: "space-between",width:`100%`,height:`30%`,borderColor:"#35f306" }}>
                        <text>Action :</text>
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