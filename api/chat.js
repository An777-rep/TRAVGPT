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
    const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "HTTP-Referer": "https://travkagpt.vercel.app",
        "X-Title": "TravkaGPT"
      },
      body: JSON.stringify({
        model: "model: "deepseek-ai/deepseek-chat",",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await apiRes.json();
    if (apiRes.ok) {
      return res.status(200).json({ response: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: data.error?.message || "API error" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Request failed: " + err.message });
  }
}
