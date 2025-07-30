console.log('🛠 theme.js loaded');

(() => {
  const params  = new URLSearchParams(location.search);
  const session = params.get('session');
  if (!session) {
    console.error('❌ Missing ?session= in URL');
    return;
  }

  // subscribe to channel 4 for incoming chat messages
  const socketUrl = `wss://io.socialstream.ninja/join/${session}/4`;
  console.log('⬢ Connecting to', socketUrl);

  const socket = new WebSocket(socketUrl);

  socket.addEventListener('open', () => {
    console.log('✅ WebSocket connected');
  });

  socket.addEventListener('error', err => {
    console.error('❌ WebSocket error', err);
  });

  socket.addEventListener('message', event => {
    console.log('🔔 Received raw:', event.data);
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      console.error('❌ Invalid JSON', event.data);
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

    if (container.children.length > 20) {
      container.removeChild(container.firstChild);
    }
  }
})();
