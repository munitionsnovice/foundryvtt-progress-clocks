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

test("sets size to a supported size if supplied an unsupported size", t => {
    const size = 1;
    const clock = new Clock({
        size: size
    });
    t.assert(Clock.sizes.indexOf(parseInt(size)) == -1);
    t.assert(Clock.sizes.indexOf(parseInt(clock.size)) >= 0);
});

test("sets a default size when none is provided", t=> {
    const clock = new Clock();
    t.assert(clock.size);
});
