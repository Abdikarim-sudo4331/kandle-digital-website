// Seeds the CMS tables with the site's current copy. Safe to re-run:
// existing content blocks are left alone, and services are only inserted
// when the table is empty.
import { contentBlocks, services } from "@shared/schema";
import { contentKeys, defaultContent, defaultServices } from "@shared/content";
import { db, pool } from "../server/db";

async function seed() {
  await db
    .insert(contentBlocks)
    .values(contentKeys.map((key) => ({ key, data: defaultContent[key] })))
    .onConflictDoNothing();
  console.log(`content blocks: ensured ${contentKeys.join(", ")}`);

  const existing = await db.select({ id: services.id }).from(services).limit(1);
  if (existing.length === 0) {
    await db.insert(services).values(defaultServices);
    console.log(`services: inserted ${defaultServices.length}`);
  } else {
    console.log("services: table not empty, skipped");
  }
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
