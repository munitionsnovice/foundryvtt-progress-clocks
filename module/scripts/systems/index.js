import DND5E from "./dnd5e.js";
import BitD from "./blades-in-the-dark.js";

const SUPPORTED_SYSTEMS = {
  "blades-in-the-dark": "BitD",
  "dnd5e": "DND5E"
};

const defaultLoadClockFromActor = ({ actor }) => {
  return {
    progress: actor.getFlag("lancer-clocks", "progress"),
    size: actor.getFlag("lancer-clocks", "size"),
    theme: actor.getFlag("lancer-clocks", "theme")
  };
};

const defaultPersistClockToActor = async ({ clock }) => {
  return {
    flags: {
      "lancer-clocks": {
        progress: clock.progress,
        size: clock.size,
        theme: clock.theme
      }
    }
  };
};

export const getSystemMapping = (id) => {
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
