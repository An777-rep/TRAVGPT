
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  input.disabled = true;
  submitBtn.disabled = true;

  appendMessage("user", message);
  input.value = "";

  const botMsg = appendMessage("bot", "");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    if (res.ok) {
      const html = marked.parse(data.response);
      await typeText(botMsg, html);
    } else {
      botMsg.textContent = "❌ Ошибка: " + (data.error || "Неизвестная ошибка");
    }
  } catch (err) {
    botMsg.textContent = "❌ Ошибка запроса: " + err.message;
  }

  input.disabled = false;
  submitBtn.disabled = false;
  input.focus();
});

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "bot");
  div.innerHTML = role === "user" ? text : "";
  messages.appendChild(div);
  div.scrollIntoView({ behavior: "smooth" });
  return div;
}

async function typeText(element, html, delay = 10) {
  element.innerHTML = "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const nodes = [...temp.childNodes];

  for (const node of nodes) {
    if (node.nodeType === 3) {
      for (let char of node.textContent) {
        element.innerHTML += char;
        await new Promise((r) => setTimeout(r, delay));
      }
    } else {
      element.appendChild(node);
    }
  }
  highlightAndEnableCopy(element);
}

function highlightAndEnableCopy(container) {
  hljs.highlightAll();
  container.querySelectorAll("pre code").forEach((code) => {
    if (!code.querySelector(".copy-btn")) {
      const btn = document.createElement("button");
      btn.textContent = "Скопировать";
      btn.className = "copy-btn";
      btn.onclick = () => {
        navigator.clipboard.writeText(code.innerText);
        btn.textContent = "Скопировано!";
        setTimeout(() => (btn.textContent = "Скопировать"), 1500);
      };
      code.appendChild(btn);
    }
  });
}
