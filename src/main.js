const { clear: clearConsole } = require('./log');
const { updateTimer } = require('./timer');
const { toggleFullscreen } = require('./ui');
const { setup: setupEditor } = require('./editor');

module.exports = function main() {
  setupEditor();

  document.getElementById('btn-reset').addEventListener('click', e => {
    location.href = location.pathname;
  });
  document.getElementById('btn-timer').addEventListener('click', e => {
    updateTimer();
  });
  document.getElementById('btn-clear').addEventListener('click', e => {
    clearConsole();
  });
  document.getElementById('btn-fullscreen').addEventListener('click', e => {
    toggleFullscreen();
  });
};
