console.log('🛠 theme.js loaded');

(() => {
  const params  = new URLSearchParams(location.search);
  const session = params.get('session');

  if (!session) {
    console.error('❌ Missing ?session= in URL');
    return;
  }

  // Use SSE on the hosted service
  const sseUrl = `https://io.socialstream.ninja/sse/${session}`;
  console.log('⬢ Connecting via SSE to', sseUrl);

  const source = new EventSource(sseUrl);

  source.addEventListener('open', () => {
    console.log('✅ SSE connection opened');
  });

  source.addEventListener('error', err => {
    console.error('❌ SSE error', err);
  });

  source.addEventListener('message', e => {
    console.log('🔔 SSE message', e.data);
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch {
      console.error('❌ Invalid JSON', e.data);
      return;
    }
    renderMessage(msg);
  });

  function renderMessage(msg) {
    const container = document.getElementById('chat-container');
    if (!container) return console.error('❌ No #chat-container found');
    const div = document.createElement('div');
    div.className   = 'chat-message';
    div.textContent = `${msg.chatname || msg.username}: ${msg.chatmessage || msg.text}`;
    container.appendChild(div);

    // keep only the latest 20
    if (container.children.length > 20) {
      container.removeChild(container.firstChild);
    }
  }
})();
