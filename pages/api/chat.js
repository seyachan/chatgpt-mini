// pages/api/chat.js

export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await fetch(`${process.env.OPENAI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // 最新のGroq対応モデル
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    console.log("Groq response:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        reply: "Groqから返答がありませんでした。",
        raw: data,
      });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("API通信エラー:", error);
    res.status(500).json({ reply: "API通信に失敗しました。" });
  }
}
