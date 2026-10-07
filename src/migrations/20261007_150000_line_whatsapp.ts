import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`whatsapp\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`line\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`whatsapp\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`line\`;`)
}
