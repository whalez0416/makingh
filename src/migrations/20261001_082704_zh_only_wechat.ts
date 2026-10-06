import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`wechat_id\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`wechat_qr_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`site_settings_wechat_qr_idx\` ON \`site_settings\` (\`wechat_qr_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tel\` text NOT NULL,
  	\`fax\` text,
  	\`map_url\` text,
  	\`instagram\` text,
  	\`kakao\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "tel", "fax", "map_url", "instagram", "kakao", "updated_at", "created_at") SELECT "id", "tel", "fax", "map_url", "instagram", "kakao", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
}
