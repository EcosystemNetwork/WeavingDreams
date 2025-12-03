import { db } from "./db";
import { badges } from "@shared/schema";
import { GENERATION_TIME_BADGES } from "./badgeConstants";

export async function seedGenerationBadges(): Promise<void> {
  try {
    for (const badge of Object.values(GENERATION_TIME_BADGES)) {
      const existing = await db.query.badges.findFirst({
        where: (t, { eq }) => eq(t.id, badge.id),
      }).catch(() => null);
      
      if (!existing) {
        await db.insert(badges).values({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          color: (badge as any).color || "#8b5cf6",
          type: "generation_time",
        });
        console.log(`Seeded badge: ${badge.name}`);
      }
    }
  } catch (error) {
    console.error("Error seeding badges:", error);
  }
}
