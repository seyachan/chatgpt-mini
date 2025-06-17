import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

// このAPIは、安定したNode.jsランタイムで動作させます
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: '`messages` is required.' });
    }

    const stream = await openai.chat.completions.create({
      model: 'llama3-8b-8192', // 使用するモデル名
      stream: true,
      messages: messages,
    });

    // ✅【修正点1】ストリーミングに適したヘッダーに変更
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
    });

    // ✅【修正点2】for...await...of ループでストリームを処理
    for await (const chunk of stream) {
      // ✅【修正点3】フロントエンドがパースできるよう、`data: ` プレフィックスとJSON形式で送信
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    // ✅【修正点4】ストリームの終了を知らせる（フロントの実装がこれを期待しているため）
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('❗ [API CATCH ERROR]:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.end();
    }
  }
}