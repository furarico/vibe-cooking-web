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
    const apiKey = process.env.GEMINI_API_KEY ?? '';
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async generateOrderedInstructions(
    recipeIds: string[],
    instructions: GeminiInstruction[]
  ): Promise<GeminiResponse> {
    // IDリストを明示的に作成
    const availableIds = instructions.map(inst => inst.id);

    const prompt = `以下の手順（Instruction）を最適な調理順序で並び替えて、提供されたInstructionのIDのみを順序通りに配列で返してください。

    条件：
    - 調理器具や作業スペースの共有や火を使う時間、冷ます時間などの待ち時間を考慮し、無駄な待ち時間を減らす。
    - 手順の内容は変えず、順番のみ入れ替える。

**重要な制約:**
1. 以下の有効なIDリストのIDのみを使用してください
2. 新しいIDを生成してはいけません
3. リストにないIDを使用してはいけません
4. 全てのIDを1回ずつ含める必要があります
5. IDの重複は禁止です

**有効なIDリスト:**
${availableIds.map(id => `- ${id}`).join('\n')}

**対象レシピ ID:** ${JSON.stringify(recipeIds)}

**Instructionの詳細:**
${instructions
  .map(
    inst => `ID: ${inst.id}
レシピID: ${inst.recipeId}
説明: ${inst.description}
---`
  )
  .join('\n')}

上記の制約に従い、調理の効率性と論理的な順序を考慮して、有効なIDリストのIDのみを使用した最適な手順順序の配列を作成してください。`;

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
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

      const parsedResponse = JSON.parse(text) as GeminiResponse;

      // レスポンスの検証
      if (
        !parsedResponse.instructionIds ||
        !Array.isArray(parsedResponse.instructionIds)
      ) {
        throw new Error(
          'Invalid response format: instructionIds must be an array'
        );
      }

      // 重複チェック
      const uniqueIds = new Set(parsedResponse.instructionIds);
      if (uniqueIds.size !== parsedResponse.instructionIds.length) {
        console.warn('Gemini returned duplicate IDs, removing duplicates');
        parsedResponse.instructionIds = Array.from(uniqueIds);
      }

      // 有効なIDのセット
      const validIdSet = new Set(availableIds);

      // 無効なIDをログ出力
      const invalidIds = parsedResponse.instructionIds.filter(
        id => !validIdSet.has(id)
      );
      if (invalidIds.length > 0) {
        console.warn('Gemini returned invalid IDs:', invalidIds);
      }

      // 不足しているIDをログ出力
      const missingIds = availableIds.filter(
        id => !parsedResponse.instructionIds.includes(id)
      );
      if (missingIds.length > 0) {
        console.warn('Gemini missed IDs:', missingIds);
      }

      return parsedResponse;
    } catch (error) {
      throw new Error(`Failed to parse Gemini response as JSON: ${error}`);
    }
  }
}
