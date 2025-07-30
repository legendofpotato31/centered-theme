// read URL params
const params  = new URLSearchParams(location.search);
const session = params.get('session');
const server  = params.has('server');

// choose ws or wss
const protocol = server
  ? location.protocol.replace('http','ws')
  : 'wss';
const host = server
  ? `//localhost:8080`
  : `//ssn.socialstream.ninja`;
const socketUrl = `${protocol}${host}/stream/${session}`;

// connect
const socket = new WebSocket(socketUrl);

socket.addEventListener('open', () => {
  console.log('Chat socket open', socketUrl);
});

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  renderMessage(data);
});

// render incoming message
function renderMessage(msg) {
  const container = document.getElementById('chat-container');
  const div = document.createElement('div');
  div.className = 'chat-message';
  div.textContent = `${msg.username}: ${msg.text}`;
  container.appendChild(div);

  // remove old messages beyond 20
  if (container.children.length > 20) {
    container.removeChild(container.firstChild);
  }
}
