import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { product, target, platform } = await request.json();

    if (!product || !target || !platform) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    const isTextPlatform = platform === "Threads" || platform === "X(Twitter)";

    const prompt = isTextPlatform
      ? `あなたはSNSマーケティングのプロです。以下の情報をもとに、${platform}でバズるテキスト投稿を作成してください。

商品/サービス: ${product}
ターゲット: ${target}
プラットフォーム: ${platform}

以下の形式で出力してください：

【投稿文】
[読んだ人が思わず止まるフックから始まり、価値を伝え、行動を促す投稿文。Threadsなら500文字以内、Xなら140文字以内]

【ハッシュタグ】
[5〜8個]

【投稿のポイント】
1. [フックのTips]
2. [構成のTips]
3. [エンゲージメントを上げるTips]`
      : `あなたはSNSマーケティングと動画編集のプロです。以下の情報をもとに、${platform}でバズるショート動画（30秒以内）のスクリプトを作成してください。

商品/サービス: ${product}
ターゲット: ${target}
プラットフォーム: ${platform}

以下の形式で出力してください：

【動画構成】
・冒頭（0〜3秒）: [視聴者が思わず止まるフック]
・本編（3〜25秒）: [価値を伝えるメインコンテンツ]
・締め（25〜30秒）: [行動を促すCTA]

【スクリプト（テロップ・セリフ）】
[具体的な文章]

【ハッシュタグ】
[10〜15個]

【編集のポイント】
1. [カット・テンポのTips]
2. [テロップのTips]
3. [BGM・効果音のTips]`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "スクリプト生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
