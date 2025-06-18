import { GoogleGenAI, Type } from '@google/genai';

export interface GeminiInstruction {
  id: string;
  description: string;
  recipeId: string;
}

export interface GeminiResponse {
  instructionIds: string[];
}

export class GeminiClient {
  private genAI: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async generateOrderedInstructions(
    recipeIds: string[],
    instructions: GeminiInstruction[]
  ): Promise<GeminiResponse> {
    const prompt = `次のレシピ ID に対応する手順（Instruction）を最適な調理順序で並び替えて、InstructionのIDのみを順序通りに配列で返してください。

レシピ ID: ${JSON.stringify(recipeIds)}

各Instructionの詳細:
${instructions.map(inst => `- ID: ${inst.id}, レシピID: ${inst.recipeId}, 説明: ${inst.description}`).join('\n')}

調理の効率性と論理的な順序を考慮して、最も適切な手順順序でInstructionのIDを配列で返してください。`;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instructionIds: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: '並び替え後のInstructionのID',
              },
              description: '最適な調理順序で並び替えられたInstructionのID配列',
            },
          },
          required: ['instructionIds'],
        },
      },
    });

    try {
      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini');
      }
      return JSON.parse(text) as GeminiResponse;
    } catch (error) {
      throw new Error(`Failed to parse Gemini response as JSON: ${error}`);
    }
  }
}
