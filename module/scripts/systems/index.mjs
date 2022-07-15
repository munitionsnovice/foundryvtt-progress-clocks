import DND5E from "./dnd5e.mjs";
import BitD from "./blades-in-the-dark.mjs";

const SUPPORTED_SYSTEMS = {
    "blades-in-the-dark": "BitD",
    "dnd5e": "DND5E"
};

const defaultLoadClockFromActor = ({ actor }) => {
    return {
        progress: actor.getFlag("progress-clocks", "progress"),
        size: actor.getFlag("progress-clocks", "size"),
        theme: actor.getFlag("progress-clocks", "theme")
    };
};

const defaultPersistClockToActor = async ({ clock }) => {
    return {
      flags: {
          "progress-clocks": {
              progress: clock.progress,
              size: clock.size,
              theme: clock.theme
          }
      }
    };
};

export const getSystemMapping = id => {
    const defaultSystemConfig = {
        loadClockFromActor: defaultLoadClockFromActor,
        persistClockToActor: defaultPersistClockToActor
    };

    if (!SUPPORTED_SYSTEMS[id]) {
        return {
            id,
            ...defaultSystemConfig,
            registerSheetOptions: {
                types: game.data.system.template.Actor.types
            }
        };
    }

    return {
        id,
        ...defaultSystemConfig,
        ...SUPPORTED_SYSTEMS[id]
    };
};
