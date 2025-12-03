import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!,
  httpOptions: {
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export interface CharacterImagePrompt {
  name: string;
  archetype: string;
  personality: string;
  background: string;
}

export async function generateCharacterImage(character: CharacterImagePrompt): Promise<string> {
  const prompt = `Create a detailed character portrait for a narrative story character:
Name: ${character.name}
Archetype: ${character.archetype}
Personality: ${character.personality}
Background: ${character.background}

Style: Digital art, fantasy character portrait, dramatic lighting, detailed features, cinematic quality. The character should be shown from shoulders up, facing slightly to the side with an engaging expression that reflects their personality.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Failed to generate character image:", error);
    throw error;
  }
}

export async function generateCharacterProfile(): Promise<{
  name: string;
  archetype: string;
  background: string;
  personality: string;
  motivation: string;
  flaw: string;
  trait: string;
}> {
  const prompt = `Generate a unique character profile for a narrative story. Return ONLY a JSON object with these exact fields:
{
  "name": "A unique fantasy/sci-fi name",
  "archetype": "One of: Hero, Mentor, Shadow, Trickster, Lover, Caregiver, Innocent, Sage, Explorer, Rebel",
  "background": "2-3 sentences about their origin and history",
  "personality": "2-3 sentences describing their temperament and behavior",
  "motivation": "What drives this character (1-2 sentences)",
  "flaw": "Their main weakness or vulnerability (1-2 sentences)",
  "trait": "A special skill or defining characteristic (1-2 sentences)"
}

Be creative and make the character compelling and unique.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    let text = "";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text += part.text;
        }
      }
    }
    
    if (!text) {
      throw new Error("No text in AI response");
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        name: parsed.name || "Unknown",
        archetype: parsed.archetype || "Hero",
        background: parsed.background || "A mysterious past",
        personality: parsed.personality || "Enigmatic and reserved",
        motivation: parsed.motivation || "Seeking purpose",
        flaw: parsed.flaw || "Struggles with trust",
        trait: parsed.trait || "Keen intuition",
      };
    }

    throw new Error("Failed to parse character profile from AI response");
  } catch (error) {
    console.error("Failed to generate character profile:", error);
    throw error;
  }
}
