const { ipcRenderer } = require('electron');

const button = document.getElementById('toggle');
const status = document.getElementById('status');

let enabled = false;

function updateUi() {
  button.textContent = enabled ? 'Turn Off' : 'Turn On';
  status.textContent = enabled ? 'Preventing display sleep' : 'Sleep allowed';
}

button.addEventListener('click', async () => {
  enabled = !enabled;
  updateUi();
  await ipcRenderer.invoke('set-sleep-block', enabled);
});

ipcRenderer.on('sleep-block-state', (_event, value) => {
  enabled = value;
  updateUi();
});

updateUi();
