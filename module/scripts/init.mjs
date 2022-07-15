import { ClockSheet } from "./sheet.mjs";

Hooks.once("init", () => {
    ClockSheet.register();
});
