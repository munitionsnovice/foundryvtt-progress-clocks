import { Clock } from "./clock.js";
import { log, error } from "./util.js";

const onClick = async () => {
  log('Tool Clicked');
  const clock = new Clock();
  await clock.themesPromise;
  await clock.extraThemesPromise;
  //console.log(clock);
  //console.log(clock._themes)
	
  let compiledTileThemes = [];
  compiledTileThemes.push(...clock._themes,...(clock._extraThemes ?? []));
  //console.log(compiledThemes);
	
  let compiledTileThemePaths = [];
  compiledTileThemePaths.push(...clock._themePaths,...(clock._extraThemePaths ?? []))
  //console.log(compiledThemePaths)
	
  let themeTileDict = {};
  compiledTileThemes.forEach((themeItem) =>{
	themeTileDict[themeItem] = compiledTileThemePaths[compiledTileThemes.indexOf(themeItem)]
  });
  const dim = {
    x: ((canvas.dimensions.sceneRect.width - clock.image.width) / 2) + canvas.dimensions.paddingX,
    y: ((canvas.dimensions.sceneRect.height - clock.image.height) / 2) + canvas.dimensions.paddingY
  };

  const tile = new Tile({
    img: `/${themeTileDict[clock.theme]}/${clock.size}clock_${clock.progress}.png`,
    width: clock.image.width,
    height: clock.image.height,
    x: dim.x,
    y: dim.y,
    z: 900,
    rotation: 0,
    hidden: false,
    locked: false,
    flags: clock.flags
  });
  canvas.scene.createEmbeddedEntity('Tile', tile.data);
};

export default {
  getSceneControlButtons: (controls) => {
    const tiles = controls.find((c) => c.name === "tiles");
    tiles.tools.push({
      name: "clocks",
      title: "Clocks",
      icon: "fas fa-clock",
      onClick,
      button: true
    });
  },

  renderTileHUD: async (_hud, html, tile) => {
    log("Render")
    let t = canvas.tiles.get(tile._id);
    if (!t.data.flags.clocks) {
      return;
    }

    const buttonHTML = await renderTemplate('/modules/lancer-clocks/templates/buttons.html');
    html.find("div.left").append(buttonHTML).click(async (event) => {
      log("HUD Clicked")
      // re-get in case there has been an update
      t = canvas.tiles.get(tile._id);

      const oldClock = new Clock(t.data.flags.clocks);
	  await oldClock.themesPromise;
	  await oldClock.extraThemesPromise;
	  //console.log(clock);
	  //console.log(clock._themes)
		
	  let compiledNewTileThemes = [];
	  compiledNewTileThemes.push(...oldClock._themes,...(oldClock._extraThemes ?? []));
	  //console.log(compiledThemes);
	
	  let compiledNewTileThemePaths = [];
	  compiledNewTileThemePaths.push(...oldClock._themePaths,...(oldClock._extraThemePaths ?? []))
	  //console.log(compiledThemePaths)
	
	  let themeNewTileDict = {};
	  compiledNewTileThemes.forEach((themeItem) =>{
		  themeNewTileDict[themeItem] = compiledNewTileThemePaths[compiledNewTileThemes.indexOf(themeItem)]
	  });
      let newClock;

      const target = event.target.classList.contains("control-icon")
        ? event.target
        : event.target.parentElement;
      if (target.classList.contains("cycle-size")) {
        newClock = oldClock.cycleSize();
      } else if (target.classList.contains("progress-up")) {
        newClock = oldClock.increment();
      } else if (target.classList.contains("progress-down")) {
        newClock = oldClock.decrement();
      } else {
        return error("ERROR: Unknown TileHUD Button");
      }

      await t.update({
        img: `/${themeNewTileDict[newClock.theme]}/${newClock.size}clock_${newClock.progress}.png`,
        flags: newClock.flags
      });
    });
  }
};
