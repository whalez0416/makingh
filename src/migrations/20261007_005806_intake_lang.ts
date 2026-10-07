import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`reservations\` ADD \`lang\` text DEFAULT 'ko';`)
  await db.run(sql`ALTER TABLE \`inquiries\` ADD \`lang\` text DEFAULT 'ko';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`reservations\` DROP COLUMN \`lang\`;`)
  await db.run(sql`ALTER TABLE \`inquiries\` DROP COLUMN \`lang\`;`)
}
