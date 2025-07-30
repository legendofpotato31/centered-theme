// debug at top
console.log('🛠 theme.js loaded');

(function(){
  const params   = new URLSearchParams(location.search);
  const session  = params.get('session');
  const useLocal = params.has('server');

  if (!session) {
    console.error('❌ No session param in URL. Did you include ?session=XYZ?');
    return;
  }

  // pick the right socket URL
  const socketUrl = useLocal
    ? `ws://localhost:8080/stream/${session}`
    : `wss://ssn.socialstream.ninja/stream/${session}`;

  console.log('⬢ Connecting to', socketUrl);

  let socket;
  try {
    socket = new WebSocket(socketUrl);
  } catch (e) {
    console.error('❌ WebSocket creation failed', e);
    return;
  }

  socket.addEventListener('open', () => {
    console.log('✅ WebSocket connected');
  });

  socket.addEventListener('error', err => {
    console.error('❌ WebSocket error', err);
  });

  socket.addEventListener('message', event => {
    console.log('🔔 Received raw:', event.data);
    try {
      const msg = JSON.parse(event.data);
      renderMessage(msg);
    } catch (err) {
      console.error('❌ Failed to parse message', err);
    }
  });

  function renderMessage(msg) {
    const container = document.getElementById('chat-container');
    if (!container) {
      console.error('❌ No #chat-container element');
      return;
    }
    const div = document.createElement('div');
    div.className   = 'chat-message';
    div.textContent = `${msg.username}: ${msg.text}`;
    container.appendChild(div);

    // cap at 20 messages
    if (container.children.length > 20) {
      container.removeChild(container.firstChild);
    }
  }
})();
