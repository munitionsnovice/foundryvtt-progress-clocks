import { ClockSheet } from "./sheet.js";
//import Tiles from "./tiles.js";
import { log } from "./util.js";

Hooks.once("init", () => {
  log(`Init ${game.data.system.id}`);
  ClockSheet.register();
  game.settings.register("lancer-clocks","extraPaths",{
		name: 'Extra Lancer Clocks Path',
		hint: 'This is the directory within the data path for custom clocks. This does not get created automatically and should be a folder that currently exists in the system.',
		scope: 'client',
		config: true,
		type: String,
		default: 'lancer-clocks',
	});
	let extraPath = game.settings.get("lancer-clocks","extraPaths");
	if (!(extraPath.endsWith("/"))) {
			extraPath = extraPath+"/"
	};
	let pathPromise = FilePicker.browse("data",extraPath).then(Bep => {
		console.log("Foundry VTT | Lancer Clocks | Found custom user directory.")}
	).catch(err => {
		FilePicker.createDirectory("data",extraPath)
		console.log("Foundry VTT | Lancer Clocks | Created custom user directory.")})

});

/* Hooks.on("getSceneControlButtons", (controls) => {
  Tiles.getSceneControlButtons(controls);
});

Hooks.on("renderTileHUD", async (hud, html, tile) => {
  await Tiles.renderTileHUD(hud, html, tile);
}); */
