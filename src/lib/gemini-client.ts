import { GoogleGenerativeAI } from '@google/generative-ai';

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
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateOrderedInstructions(
    recipeIds: string[],
    instructions: GeminiInstruction[]
  ): Promise<GeminiResponse> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      tools: [
        {
          functionDeclarations: [
            {
              name: 'generate_ordered_instructions',
              description:
                '与えられたInstructionのIDと説明から、最適な調理順序を決定し、そのInstructionのIDと並び替え後のステップ番号を返却する。',
              parameters: {
                type: 'object',
                properties: {
                  instructions: {
                    type: 'array',
                    description: '並び替えるInstructionのIDと説明のリスト',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description: 'InstructionのID',
                        },
                        description: {
                          type: 'string',
                          description: 'Instructionの説明',
                        },
                      },
                      required: ['id', 'description'],
                    },
                  },
                },
                required: ['instructions'],
              },
            },
          ],
        },
      ],
    });

    const prompt = `次のレシピ ID に対応する手順（Instruction）の ID と並び替え後の手順番号（step）を JSON 形式で返してください。

レシピ ID: ${JSON.stringify(recipeIds)}

各Instructionのdescriptionは以下の通りです。これらを最適な調理手順となるように並び替え、そのInstructionのidと並び替え後のstepのペアを返してください。

${JSON.stringify(instructions)}`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const functionCalls = response.functionCalls();

    if (!functionCalls || functionCalls.length === 0) {
      throw new Error('Gemini did not return function call');
    }

    const functionCall = functionCalls[0];
    if (functionCall.name !== 'generate_ordered_instructions') {
      throw new Error('Unexpected function call name');
    }

    const args = functionCall.args as { instructions: GeminiInstruction[] };

    // Function callの結果をGeminiResponseの形式に変換
    const orderedInstructions = args.instructions.map((instruction, index) => ({
      instructionId: instruction.id,
      step: index + 1,
    }));

    return {
      instructions: orderedInstructions,
    };
  }
}
