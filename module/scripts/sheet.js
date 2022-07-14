import { Clock } from "./clock.js";
import { getSystemMapping } from "./systems/index.js";

const DISPLAY_NAME = {
    ALWAYS_FOR_EVERYONE: 50
};
const DISPOSITION = {
    NEUTRAL: 0
};
const DEFAULT_TOKEN = {
    scale: 1,
    disposition: DISPOSITION.NEUTRAL,
    displayName: DISPLAY_NAME.ALWAYS_FOR_EVERYONE,
    actorLink: true
};

export class ClockSheet extends ActorSheet {
    static get defaultOptions() {
        const supportedSystem = getSystemMapping(game.data.system.id);
        return mergeObject(
            super.defaultOptions,
            {
                classes: [
                    "progress-clocks",
                    "sheet",
                    `progress-clocks-system-${game.data.system.id}`,
                    "actor",
                    "npc"
                ],
                template: "modules/progress-clocks/templates/sheet.html",
                width: 375,
                height: 600,
                ...supportedSystem.sheetDefaultOptions
            }
        );
    }

    static register () {
        const supportedSystem = getSystemMapping(game.data.system.id);
        Actors.registerSheet(
            supportedSystem.id,
            ClockSheet,
            supportedSystem.registerSheetOptions
        );
    }

    constructor (...args) {
        super(...args);
        this.system = getSystemMapping(game.data.system.id);
    }

    async getData () {
        const clock = new Clock(
            this.system.loadClockFromActor({
                actor: this.actor
            })
        );
        return mergeObject(super.getData(), {
            clock: {
                progress: clock.progress,
                size: clock.size,
                theme: clock.theme,
                image: {
                    url: (
                        `/${Clock.themes[clock.theme]}` +
                        `/${clock.size}clock_${clock.progress}.png`
                    ),
                    width: Clock.image.width,
                    height: Clock.image.height
                },
                settings: {
                    sizes: Clock.sizes,
                    themes: Object.keys(Clock.themes)
                }
            }
        });
    }

    activateListeners (html) {
        super.activateListeners(html);

        html.find("button[name=minus]").click(async (e) => {
            e.preventDefault();
            const oldClock = new Clock(
                this.system.loadClockFromActor({
                    actor: this.actor
                })
            );
            this.updateClock(oldClock.decrement());
        });

        html.find("button[name=plus]").click(async (e) => {
            e.preventDefault();
            const oldClock = new Clock(
                this.system.loadClockFromActor({
                    actor: this.actor
                })
            );
            this.updateClock(oldClock.increment());
        });

        html.find("button[name=reset]").click(async (e) => {
            e.preventDefault();
            const oldClock = new Clock(
                this.system.loadClockFromActor({
                    actor: this.actor
                })
            );
            const newClock = new Clock({
                theme: oldClock.theme,
                progress: 0,
                size: oldClock.size
            });
            this.updateClock(newClock);
        });
    }

    async _updateObject(_event, form) {
        await this.object.update({
            name: form.name
        });
        const oldClock = new Clock(
            this.system.loadClockFromActor({
                actor: this.actor
            })
        );
        let newClock = new Clock({
            progress: oldClock.progress,
            size: form.size,
            theme: form.theme
        });
        await this.updateClock(newClock);
    }

    async updateClock(clock) {
        const actor = this.actor;

	      let fullVer = game.version ?? game.data.version;

        // update associated tokens
        const tokens = actor.getActiveTokens();
	      let verMajor = fullVer.slice(0,3);

        for (const token of tokens) {
		        //version check for compatability
		        if (verMajor == "0.8" || verMajor.startsWith("9")) {
			          await token.document.update({
				            name: actor.name,
				            img: (
                        `/${Clock.themes[clock.theme]}` +
                        `/${clock.size}clock_${clock.progress}.png`
                    ),
				            actorLink: true
			          });
		        } else if (verMajor == "0.7"){
			          await token.update({
				            name: actor.name,
				            img: (
                        `/${Clock.themes[clock.theme]}` +
                        `/${clock.size}clock_${clock.progress}.png`
                    ),
				            actorLink: true
			          });
		        };
        }

        // update the Actor
        const persistObj = await this.system.persistClockToActor({
            actor, clock
        });
        const visualObj = {
				    img: (
                `/${Clock.themes[clock.theme]}` +
                `/${clock.size}clock_${clock.progress}.png`
            ),
            token: {
				        img: (
                    `/${Clock.themes[clock.theme]}` +
                    `/${clock.size}clock_${clock.progress}.png`
                ),
                ...DEFAULT_TOKEN
            }
        };
        await actor.update(mergeObject(visualObj, persistObj));
    }
}
