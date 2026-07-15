const cursor = document.getElementById("cursor");
const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let running = false;
let dx = 1;
let dy = 1;
const speed = 3;

function render() {
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
}

function loop() {
  if (!running) return;

  x += dx * speed;
  y += dy * speed;

  if (x <= 0 || x >= window.innerWidth) dx *= -1;
  if (y <= 0 || y >= window.innerHeight) dy *= -1;

  render();
  status.textContent = `Moving • ${Math.round(x)}, ${Math.round(y)}`;
  requestAnimationFrame(loop);
}

toggle.addEventListener("click", () => {
  running = !running;
  toggle.textContent = running ? "Pause" : "Start moving";
  status.textContent = running ? "Moving" : "Paused";
  if (running) requestAnimationFrame(loop);
});

window.addEventListener("resize", () => {
  x = Math.min(Math.max(x, 0), window.innerWidth);
  y = Math.min(Math.max(y, 0), window.innerHeight);
  render();
});

document.addEventListener("pointermove", (e) => {
  if (!running) {
    x = e.clientX;
    y = e.clientY;
    render();
  }
});

render();
