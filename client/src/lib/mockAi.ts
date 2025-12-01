// Mock service for Kie AI API
// In a real app, this would call the actual backend/AI service

export interface AISuggestion {
  text: string;
  type: 'continuation' | 'choice';
}

const MOCK_CONTINUATIONS = [
  "The door creaked open, revealing a dusty chamber filled with ancient artifacts.",
  "Suddenly, the lights flickered and died, plunging the room into absolute darkness.",
  "She hesitated, her hand hovering over the red button. Was this truly the only way?",
  "A cold wind swept through the valley, carrying whispers of a long-forgotten language.",
  "The machine hummed to life, its gears grinding with a rhythmic, metallic pulse."
];

const MOCK_CHOICES = [
  "Open the mysterious box.",
  "Run away as fast as you can.",
  "Ask the stranger for help.",
  "Hide under the desk.",
  "Draw your weapon and prepare for battle."
];

export const mockKieAi = {
  generateContinuation: async (context: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const random = Math.floor(Math.random() * MOCK_CONTINUATIONS.length);
        resolve(MOCK_CONTINUATIONS[random]);
      }, 1500);
    });
  },

  generateChoices: async (context: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return 2-3 random choices
        const count = Math.floor(Math.random() * 2) + 2;
        const shuffled = [...MOCK_CHOICES].sort(() => 0.5 - Math.random());
        resolve(shuffled.slice(0, count));
      }, 1500);
    });
  },

  analyzeTone: async (text: string): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const tones = ["Suspenseful", "Melancholic", "Action-packed", "Mysterious", "Whimsical"];
            resolve(tones[Math.floor(Math.random() * tones.length)]);
        }, 1000)
    })
  }
};
