console.log('🛠 theme.js loaded');

(function(){
  const params   = new URLSearchParams(location.search);
  const session  = params.get('session');
  const socketUrl = `wss://ssn.socialstream.ninja/stream/${session}`;

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
    const msg = JSON.parse(event.data);
    renderMessage(msg);
  });

  function renderMessage(msg) {
    const container = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.className   = 'chat-message';
    div.textContent = `${msg.username}: ${msg.text}`;
    container.appendChild(div);
    if (container.children.length > 20) {
      container.removeChild(container.firstChild);
    }
  }
})();
