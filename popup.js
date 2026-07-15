const button = document.getElementById("toggle");

async function toggle() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    const res = await chrome.tabs.sendMessage(tab.id, { type: "toggle" });
    button.textContent = res?.active ? "Pause" : "Start";
  } catch {
    button.textContent = "Start";
  }
}

button.addEventListener("click", toggle);
