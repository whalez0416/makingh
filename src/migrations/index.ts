import * as migration_20260928_142402_init from './20260928_142402_init';
import * as migration_20260929_063703_login_with_username from './20260929_063703_login_with_username';
import * as migration_20261001_082704_zh_only_wechat from './20261001_082704_zh_only_wechat';
import * as migration_20261007_005806_intake_lang from './20261007_005806_intake_lang';
import * as migration_20261007_150000_line_whatsapp from './20261007_150000_line_whatsapp';

export const migrations = [
  {
    up: migration_20260928_142402_init.up,
    down: migration_20260928_142402_init.down,
    name: '20260928_142402_init',
  },
  {
    up: migration_20260929_063703_login_with_username.up,
    down: migration_20260929_063703_login_with_username.down,
    name: '20260929_063703_login_with_username',
  },
  {
    up: migration_20261001_082704_zh_only_wechat.up,
    down: migration_20261001_082704_zh_only_wechat.down,
    name: '20261001_082704_zh_only_wechat',
  },
  {
    up: migration_20261007_005806_intake_lang.up,
    down: migration_20261007_005806_intake_lang.down,
    name: '20261007_005806_intake_lang'
  },
  {
    up: migration_20261007_150000_line_whatsapp.up,
    down: migration_20261007_150000_line_whatsapp.down,
    name: '20261007_150000_line_whatsapp'
  },
];
