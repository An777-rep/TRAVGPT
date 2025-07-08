document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    if (res.ok) appendMessage("bot", data.response);
    else appendMessage("bot", "❌ Ошибка: " + (data.error || "Неизвестная ошибка"));
  } catch (err) {
    appendMessage("bot", "❌ Ошибка запроса: " + err.message);
  }
});

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "bot");
  div.textContent = text;
  document.getElementById("messages").appendChild(div);
  div.scrollIntoView({ behavior: "smooth" });
}