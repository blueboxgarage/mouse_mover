(() => {
  if (window.__mouseMoverInjected) return;
  window.__mouseMoverInjected = true;

  let active = false;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let dx = 1;
  let dy = 1;
  const speed = 3;

  const cursor = document.createElement("div");
  cursor.style.cssText = `
    position: fixed;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid white;
    background: #22d3ee;
    pointer-events: none;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 14px rgba(34, 211, 238, 0.7);
    z-index: 2147483647;
  `;
  document.documentElement.appendChild(cursor);

  function render() {
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  }

  function loop() {
    if (!active) return;
    x += dx * speed;
    y += dy * speed;
    if (x <= 0 || x >= window.innerWidth) dx *= -1;
    if (y <= 0 || y >= window.innerHeight) dy *= -1;
    render();
    requestAnimationFrame(loop);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "toggle") {
      active = !active;
      if (active) {
        render();
        requestAnimationFrame(loop);
      }
      sendResponse({ active });
    }
    return true;
  });

  window.addEventListener("resize", render);
  document.addEventListener("pointermove", (event) => {
    if (!active) {
      x = event.clientX;
      y = event.clientY;
      render();
    }
  });

  render();
})();
