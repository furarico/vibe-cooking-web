import { GoogleGenAI, Type } from '@google/genai';

export interface GeminiInstruction {
  id: string;
  description: string;
}

export interface GeminiResponse {
  instructions: Array<{
    instructionId: string;
    step: number;
  }>;
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
    const prompt = `次のレシピ ID に対応する手順（Instruction）の ID と並び替え後の手順番号（step）を最適な調理順序で返してください。

レシピ ID: ${JSON.stringify(recipeIds)}

各Instructionの詳細:
${instructions.map(inst => `- ID: ${inst.id}, 説明: ${inst.description}`).join('\n')}

これらを最適な調理手順となるように並び替え、各InstructionのIDと並び替え後のステップ番号のペアをJSON形式で返してください。
調理の効率性と論理的な順序を考慮して、最も適切な手順順序を決定してください。`;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instructions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  instructionId: {
                    type: Type.STRING,
                    description: 'InstructionのID',
                  },
                  step: {
                    type: Type.NUMBER,
                    description: '並び替え後のステップ番号',
                  },
                },
                required: ['instructionId', 'step'],
              },
            },
          },
          required: ['instructions'],
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
