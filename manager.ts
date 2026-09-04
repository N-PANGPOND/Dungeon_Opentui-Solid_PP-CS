import { createSignal } from "solid-js"


export type position = {
    x: number
    y: number
}



const [player, playerState] = createSignal<position>({ x: 2, y: 2 })

let lastTime = performance.now()
const speed = 0.1
let direction = 1
function updatePlayerPosition(key: string) {
    switch (key) {
        case "up":
        case "w":
            playerState({ x: player().x, y: player().y - 1 })
            break
        case "down":
        case "s":
            playerState({ x: player().x, y: player().y + 1 })
            break
        case "left":
        case "a":
            playerState({ x: player().x - 1, y: player().y })
            break
        case "right":
        case "d":
            playerState({ x: player().x + 1, y: player().y })
            break
    }
}
export const useplayer = () => {
    return {
        player: player,
        playerState: playerState,
        updatePlayerPosition
    }
}