import { IPlugin, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { onViUpdate } from "modloader64_api/PluginLifecycle";
import { MK64Courses, CourseNames } from "./courses";

class mk64rando implements IPlugin {
    ModLoader!: IModLoaderAPI;

    cupsStartAddr: number  = 0x800F2BB4;
    courseOrder: string[] = CourseNames;

    commonTexturesPtr: number = 0x80150264;
    commonTexturesAddr: number;

    preinit(): void {

    }
    
    init(): void {

    }
    
    postinit(): void {
        this.ModLoader.logger.debug(`${CourseNames.length}`);
    }
    
    onTick(): void {
        this.commonTexturesAddr = this.ModLoader.emulator.rdramRead32(this.commonTexturesPtr);
    }

    private WriteCourses(): void {
        for (let i = 0; i < this.courseOrder.length; i++) {
            this.ModLoader.emulator.rdramWrite16(this.cupsStartAddr + (i * 2), MK64Courses[this.courseOrder[i]]);
        }
    }

    private RandomizeCourses(): void {
        this.courseOrder = CourseNames;
        let randomIndex: number;
        let remaining: number = this.courseOrder.length;

        while (remaining) {
            randomIndex = Math.floor(Math.random() * remaining--);
            [this.courseOrder[remaining], this.courseOrder[randomIndex]] = [this.courseOrder[randomIndex], this.courseOrder[remaining]];
        }

        this.WriteCourses();
    }

    @onViUpdate()
    onViUpdate() {
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Mario Kart 64 Randomizer")) {
                if (this.ModLoader.ImGui.button("Randomize")) {
                    this.RandomizeCourses();
                }

                this.ModLoader.ImGui.labelText(this.commonTexturesAddr.toString(16), "Common Textures");

                if (this.ModLoader.ImGui.collapsingHeader("Mushroom Cup")) {
                    this.ModLoader.ImGui.labelText(this.courseOrder[0], "Mushroom Cup 1");
                    this.ModLoader.ImGui.labelText(this.courseOrder[1], "Mushroom Cup 2");
                    this.ModLoader.ImGui.labelText(this.courseOrder[2], "Mushroom Cup 3");
                    this.ModLoader.ImGui.labelText(this.courseOrder[3], "Mushroom Cup 4");
                }
                
                if (this.ModLoader.ImGui.collapsingHeader("Flower Cup")) {
                    this.ModLoader.ImGui.labelText(this.courseOrder[4], "Flower Cup 1");
                    this.ModLoader.ImGui.labelText(this.courseOrder[5], "Flower Cup 2");
                    this.ModLoader.ImGui.labelText(this.courseOrder[6], "Flower Cup 3");
                    this.ModLoader.ImGui.labelText(this.courseOrder[7], "Flower Cup 4");
                }
                
                if (this.ModLoader.ImGui.collapsingHeader("Star Cup")) {
                    this.ModLoader.ImGui.labelText(this.courseOrder[8], "Star Cup 1");
                    this.ModLoader.ImGui.labelText(this.courseOrder[9], "Star Cup 2");
                    this.ModLoader.ImGui.labelText(this.courseOrder[10], "Star Cup 3");
                    this.ModLoader.ImGui.labelText(this.courseOrder[11], "Star Cup 4");
                }
                
                if (this.ModLoader.ImGui.collapsingHeader("Special Cup")) {
                    this.ModLoader.ImGui.labelText(this.courseOrder[12], "Special Cup 1");
                    this.ModLoader.ImGui.labelText(this.courseOrder[13], "Special Cup 2");
                    this.ModLoader.ImGui.labelText(this.courseOrder[14], "Special Cup 3");
                    this.ModLoader.ImGui.labelText(this.courseOrder[15], "Special Cup 4");
                }

                this.ModLoader.ImGui.endMenu();
            }
            this.ModLoader.ImGui.endMainMenuBar();
        }
    }
}

module.exports = mk64rando;