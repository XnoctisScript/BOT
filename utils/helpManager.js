const fs = require('fs');
const path = require('path');

const HELP_FILE = path.join(__dirname, '..', 'help.json');

function loadHelp() {
  if (!fs.existsSync(HELP_FILE)) {
    const defaults = { public: [], staff: [], owner: [] };
    fs.writeFileSync(HELP_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(fs.readFileSync(HELP_FILE, 'utf8'));
}

function saveHelp(data) {
  fs.writeFileSync(HELP_FILE, JSON.stringify(data, null, 2));
}

function addEntry(role, text) {
  const data = loadHelp();
  if (!data[role]) return false;
  if (!data[role].includes(text)) {
    data[role].push(text);
    saveHelp(data);
  }
  return true;
}

function removeEntry(role, text) {
  const data = loadHelp();
  if (!data[role]) return false;
  const idx = data[role].indexOf(text);
  if (idx === -1) return false;
  data[role].splice(idx, 1);
  saveHelp(data);
  return true;
}

module.exports = { loadHelp, saveHelp, addEntry, removeEntry };
