import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: '音声ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // Web Speech API の代替として、ここでは簡単な実装を提供
    // 実際のプロダクションでは、OpenAI Whisper API や Google Speech-to-Text API などを使用
    
    // 音声ファイルをArrayBufferに変換
    const arrayBuffer = await audioFile.arrayBuffer();
    
    // この例では、Web Speech API が利用できない場合のフォールバックとして
    // 簡単なダミーレスポンスを返します
    // 実際の実装では外部APIを使用してください
    
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // ブラウザ側でWeb Speech APIを使用する場合の処理
      return NextResponse.json({
        transcript: 'ブラウザのWeb Speech APIを使用してください'
      });
    }

    // 実際の音声認識APIの実装例（OpenAI Whisper APIを使用する場合）
    /*
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('音声の文字起こしに失敗しました');
    }

    const data = await response.json();
    return NextResponse.json({ transcript: data.text });
    */

    // デモ用のレスポンス
    return NextResponse.json({
      transcript: '音声の文字起こし機能はまだ実装されていません。実際の音声認識APIを統合してください。'
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json(
      { error: '音声の文字起こしに失敗しました' },
      { status: 500 }
    );
  }
}