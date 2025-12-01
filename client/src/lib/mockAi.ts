// Mock service for Kie AI API
// In a real app, this would call the actual backend/AI service

export interface AISuggestion {
  text: string;
  type: 'continuation' | 'choice';
}

export interface Character {
  name: string;
  archetype: string;
  background: string;
  personality: string;
  motivation: string;
  flaw: string;
  trait: string;
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

const MOCK_ARCHETYPES = ["Hero", "Mentor", "Shadow", "Trickster", "Lover", "Caregiver", "Innocent"];

const MOCK_BACKGROUNDS = [
  "Grew up in a bustling port city as the child of merchants",
  "Raised in isolation within a remote mountain monastery",
  "Born into nobility but exiled for unknown reasons",
  "Escaped a brutal regime and found refuge in the shadows",
  "Survived a catastrophic event that claimed their entire family"
];

const MOCK_PERSONALITIES = [
  "Sardonic and witty, always has a clever quip ready",
  "Stoic and reserved, speaks only when necessary",
  "Charismatic and magnetic, draws others to their cause",
  "Anxious and introspective, prone to overthinking",
  "Confident and bold, rushes toward danger without hesitation"
];

const MOCK_MOTIVATIONS = [
  "Seeking redemption for a terrible mistake",
  "Hunting the truth about their mysterious past",
  "Protecting someone they love at any cost",
  "Pursuing power and influence",
  "Trying to prevent a catastrophic prophecy"
];

const MOCK_FLAWS = [
  "Struggles with trust and paranoia",
  "Prone to reckless decisions fueled by emotion",
  "Carries guilt that clouds their judgment",
  "Obsessive nature leads to tunnel vision",
  "Tendency to self-sabotage relationships"
];

const MOCK_TRAITS = [
  "Expert swordsman with an unmatched fighting style",
  "Possesses an encyclopedic knowledge of ancient lore",
  "Can read people with supernatural accuracy",
  "Master of deception and disguise",
  "Touched by magic in ways they don't understand"
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
  },

  generateCharacter: async (): Promise<Character> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const character: Character = {
          name: ["Kael", "Zephyr", "Iris", "Thorne", "Lyra", "Damian", "Sera", "Rowan"][Math.floor(Math.random() * 8)],
          archetype: MOCK_ARCHETYPES[Math.floor(Math.random() * MOCK_ARCHETYPES.length)],
          background: MOCK_BACKGROUNDS[Math.floor(Math.random() * MOCK_BACKGROUNDS.length)],
          personality: MOCK_PERSONALITIES[Math.floor(Math.random() * MOCK_PERSONALITIES.length)],
          motivation: MOCK_MOTIVATIONS[Math.floor(Math.random() * MOCK_MOTIVATIONS.length)],
          flaw: MOCK_FLAWS[Math.floor(Math.random() * MOCK_FLAWS.length)],
          trait: MOCK_TRAITS[Math.floor(Math.random() * MOCK_TRAITS.length)]
        };
        resolve(character);
      }, 1200);
    });
  }
};
