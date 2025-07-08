const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = input.scrollHeight + 'px';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  appendMessage('Вы', text, 'user');
  input.value = '';
  input.style.height = '48px';

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TRAVKA_GPT_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Ты — полезный помощник.' },
          { role: 'user', content: text }
        ]
      })
    });
    const data = await res.json();
    appendMessage('TravkaGPT', data.choices?.[0]?.message?.content || 'Ошибка ответа');
  } catch (err) {
    appendMessage('TravkaGPT', 'Ошибка сервера');
  }
});

function appendMessage(sender, text, type = '') {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = `<strong>${sender}:</strong><br>${renderMarkdown(text)}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function renderMarkdown(text) {
  return text.replace(/```(.*?)```/gs, (match, code) => {
    return `<div><button class="copy-button" onclick="copyCode(this)">Скопировать</button><pre><code class="language-js">${Prism.highlight(code, Prism.languages.javascript, 'javascript')}</code></pre></div>`;
  });
}

function copyCode(button) {
  const code = button.nextElementSibling.textContent;
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = 'Скопировано!';
    setTimeout(() => button.textContent = 'Скопировать', 1500);
  });
}
