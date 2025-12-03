// Milestone badges for generation time
export const GENERATION_TIME_BADGES = {
  THIRTY_MINUTES: {
    id: 1,
    name: "First Steps",
    description: "Complete 30 minutes of AI generations",
    icon: "🌱",
    color: "#10b981",
    threshold: 1800, // 30 minutes in seconds
  },
  ONE_HOUR: {
    id: 2,
    name: "Hour of Stories",
    description: "Complete 1 hour of AI generations",
    icon: "📖",
    color: "#8b5cf6",
    threshold: 3600, // 1 hour in seconds
  },
  THREE_HOURS: {
    id: 3,
    name: "Master Storyteller",
    description: "Complete 3 hours of AI generations",
    icon: "🎭",
    color: "#f59e0b",
    threshold: 10800, // 3 hours in seconds
  },
  FIVE_HOURS: {
    id: 4,
    name: "Creative Virtuoso",
    description: "Complete 5 hours of AI generations",
    icon: "✨",
    color: "#ec4899",
    threshold: 18000, // 5 hours in seconds
  },
};

export async function seedGenerationBadges(storage: any): Promise<void> {
  const db = (storage as any).db;
  const { badges } = await import("@shared/schema");
  const { db: database } = await import("./db");

  for (const badge of Object.values(GENERATION_TIME_BADGES)) {
    const existing = await database
      .select()
      .from(badges)
      .where((t: any) => t.id === badge.id);
    
    if (existing.length === 0) {
      await database.insert(badges).values({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        type: "generation_time",
      });
    }
  }
}
