export type SoundName =
    | "footstep"
    | "encounter"
    | "attack"
    | "strike"
    | "hit"
    | "evade"
    | "victory"
    | "gameOver"
    | "coin"
    | "potion"
    | "menuSelect"
    | "menuConfirm";

export type SoundManifest = Partial<Record<SoundName, string>>;

export function resolvePlayCommand(
    platform: NodeJS.Platform,
    filePath: string
): { cmd: string; args: string[] } {
    switch (platform) {
        case "darwin":
            return { cmd: "afplay", args: [filePath] };
        case "win32":
            return {
                cmd: "powershell",
                args: [
                    "-Sta",
                    "-c",
                    `Add-Type -AssemblyName presentationCore; $mp = New-Object System.Windows.Media.MediaPlayer; $mp.Open([uri]'${filePath}'); $mp.Play(); Start-Sleep -Milliseconds 3000`,
                ],
            };
        default:
            return { cmd: "aplay", args: [filePath] };
    }
}

export class SoundSystem {
    private static instance: SoundSystem | null = null;

    private assets: Map<SoundName, string> = new Map();
    private isMuted: boolean = false;

    private constructor() { }

    public static getInstance(): SoundSystem {
        if (!SoundSystem.instance) {
            SoundSystem.instance = new SoundSystem();
        }
        return SoundSystem.instance;
    }

    public register(name: SoundName, filePath: string): void {
        this.assets.set(name, filePath);
    }

    public loadManifest(manifest: SoundManifest): void {
        for (const [name, filePath] of Object.entries(manifest) as [SoundName, string][]) {
            this.register(name, filePath);
        }
    }

    public mute(): void {
        this.isMuted = true;
    }

    public unmute(): void {
        this.isMuted = false;
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    public getIsMuted(): boolean {
        return this.isMuted;
    }

    public play(name: SoundName): void {
        if (this.isMuted) {
            return;
        }

        const filePath = this.assets.get(name);
        if (!filePath) {
            console.error(`[SoundSystem] ไม่พบไฟล์เสียงสำหรับ "${name}"`);
            return;
        }

        const { cmd, args } = resolvePlayCommand(process.platform, filePath);

        try {
            Bun.spawn([cmd, ...args], {
                stdout: "ignore",
                stderr: "ignore",
            });
        } catch (error) {
            console.error(`[SoundSystem] เล่นเสียง "${name}" ไม่สำเร็จ:`, error);
        }
    }
}

export const soundSystem = SoundSystem.getInstance();