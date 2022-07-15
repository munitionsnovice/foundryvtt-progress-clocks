import test from 'ava';

import { Clock } from "../../module/scripts/clock.mjs";

test("sets the correct theme when provided", t => {
    const clock = new Clock({
        theme: 'gms_red'
    });
    t.is(clock.theme, 'gms_red');
});

test("sets a default theme when none is provided", t => {
    const clock = new Clock();
    t.assert(clock.theme);
});
