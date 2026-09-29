import * as migration_20260928_142402_init from './20260928_142402_init';
import * as migration_20260929_063703_login_with_username from './20260929_063703_login_with_username';

export const migrations = [
  {
    up: migration_20260928_142402_init.up,
    down: migration_20260928_142402_init.down,
    name: '20260928_142402_init',
  },
  {
    up: migration_20260929_063703_login_with_username.up,
    down: migration_20260929_063703_login_with_username.down,
    name: '20260929_063703_login_with_username'
  },
];
