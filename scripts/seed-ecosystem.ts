import { db as prisma } from '../src/lib/db';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  console.log("Reading apps_local.json...");
  const data = fs.readFileSync('apps_local.json', 'utf-8');
  const apps = JSON.parse(data);

  console.log(`Found ${apps.length} apps to insert.`);

  for (const app of apps) {
    if (!app.name) continue;
    
    try {
      await prisma.ecosystemProject.upsert({
        where: { id: app.id.toString() },
        update: {
          name: app.name,
          description: app.description || "",
          category: app.category || "App",
          websiteUrl: app.link || "",
          logoUrl: app.localLogoUrl || app.icon || null,
          bannerUrl: app.localBannerUrl || app.banner || null,
          twitterUrl: app.twitterUrl || null,
        },
        create: {
          id: app.id.toString(),
          name: app.name,
          description: app.description || "",
          category: app.category || "App",
          websiteUrl: app.link || "",
          logoUrl: app.localLogoUrl || app.icon || null,
          bannerUrl: app.localBannerUrl || app.banner || null,
          twitterUrl: app.twitterUrl || null,
        }
      });
      console.log(`Inserted: ${app.name}`);
    } catch (e) {
      console.error(`Failed to insert ${app.name}:`, e.message);
    }
  }

  console.log("Deactivating removed apps...");
  const activeIds = apps.map((app: any) => app.id.toString());
  await prisma.ecosystemProject.updateMany({
    where: {
      id: { notIn: activeIds }
    },
    data: {
      active: false
    }
  });

  console.log("Done!");
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
