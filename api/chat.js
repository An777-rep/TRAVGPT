export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.KEY_TRAVKA;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not set" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://travkagpt.vercel.app",
        "X-Title": "TravkaGPT"
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-chat",
        messages: [{ role: "user", content: message }]
      })
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: "Ответ не JSON: " + text });
    }

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || text });
    }

    return res.status(200).json({ response: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: "Request failed: " + err.message });
  }
}
