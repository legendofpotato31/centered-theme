console.log('🛠 theme.js loaded');

(() => {
  const params  = new URLSearchParams(window.location.search);
  const session = params.get('session');
  if (!session) {
    return console.error('❌ Missing ?session= in URL');
  }

  // Channel 1 = chat, Channel 4 = test/featured
  // Use /1/1 for real chat, or /4/1 to catch the Ninja app “Trigger test” message.
  const socketUrl = `wss://io.socialstream.ninja/join/${session}/4/1`;
  console.log('⬢ Connecting to', socketUrl);

  const socket = new WebSocket(socketUrl);  // :contentReference[oaicite:0]{index=0}

  socket.addEventListener('open',   () => console.log('✅ WebSocket connected'));
  socket.addEventListener('error',  e => console.error('❌ WebSocket error', e));
  socket.addEventListener('message', e => {
    console.log('🔔 Raw message:', e.data);
    let msg;
    try { msg = JSON.parse(e.data); }
    catch { return console.error('❌ JSON parse failed', e.data); }
    renderMessage(msg);
  });

  function renderMessage(msg) {
    const container = document.getElementById('chat-container');
    if (!container) return console.error('❌ No #chat-container');
    const div = document.createElement('div');
    div.className   = 'chat-message';
    div.textContent = `${msg.chatname||msg.username}: ${msg.chatmessage||msg.text}`;
    container.appendChild(div);
    if (container.children.length > 20) {
      container.removeChild(container.firstChild);
    }
  }
})();
