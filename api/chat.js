export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.TRAVKA_GPT_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API ключ не найден" });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${apiKey},
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // 🚨 ВАЖНО: без ":free"
        messages: messages || [],
      }),
    });

    if (!response.ok) {
      const text = await response.text(); // Попробуем получить ошибку как текст
      return res.status(response.status).json({ error: OpenRouter error: ${text} });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
