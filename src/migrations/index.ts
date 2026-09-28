import * as migration_20260928_142402_init from './20260928_142402_init';

export const migrations = [
  {
    up: migration_20260928_142402_init.up,
    down: migration_20260928_142402_init.down,
    name: '20260928_142402_init'
  },
];
