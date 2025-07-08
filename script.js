const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Показываем сообщение пользователя
  const userBubble = document.createElement("div");
  userBubble.className = "bubble user";
  userBubble.textContent = userMessage;
  chat.appendChild(userBubble);
  input.value = "";

  // Отправка запроса
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    const reply = data.reply || "Нет ответа";

    const botBubble = document.createElement("div");
    botBubble.className = "bubble bot";
    botBubble.textContent = reply;
    chat.appendChild(botBubble);

  } catch (err) {
    const errorBubble = document.createElement("div");
    errorBubble.className = "bubble bot";
    errorBubble.textContent = "Ошибка сервера...";
    chat.appendChild(errorBubble);
  }
});
