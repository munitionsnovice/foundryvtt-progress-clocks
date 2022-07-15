import test from 'ava';

import { getFoundryVersion } from "../../module/scripts/utils.mjs";

const currentGame = {
  version: "9.0"
};

const legacyGame = {
  data: {
    version: "0.7.1"
  }
};

test("returns the correct version for a current game", t => {
  const version = getFoundryVersion(currentGame);
  t.deepEqual(version, { major: 9, minor: 0 });
});

test("returns the correct version for a legacy game", t => {
  const version = getFoundryVersion(legacyGame);
  t.deepEqual(version, { major: 7, minor: 1 });
});
