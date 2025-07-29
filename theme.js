const container = document.getElementById('social-stream-ninja');

const observer = new MutationObserver(() => {
  const messages = container.querySelectorAll('#ssn-fix-wrapper');

  // Remove all but the newest message
  messages.forEach((msg, i) => {
    if (i < messages.length - 1) msg.remove();
  });

  const msg = messages[messages.length - 1];
  if (msg) {
    msg.style.opacity = 0;

    requestAnimationFrame(() => {
      msg.style.opacity = 1;
    });

    setTimeout(() => {
      msg.style.opacity = 0;
      setTimeout(() => msg.remove(), 500);
    }, 3000);
  }
});

observer.observe(container, { childList: true });
