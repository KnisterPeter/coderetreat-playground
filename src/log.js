/**
 * Overwrite console log/error to prepare ui display
 */
const htmlLog = document.getElementById('console');

const originalLog = console.log;
console.log = function log(...args) {
  htmlLog.innerHTML += `${formatLog(args)}<br/>`;
  htmlLog.scrollTop = Number.MAX_SAFE_INTEGER
  originalLog.apply(originalLog, args);
}

const originalError = console.error;
console.error = function error(...args) {
  htmlLog.innerHTML += `<span class="error">${formatLog(args)}</span><br/>`;
  htmlLog.scrollTop = Number.MAX_SAFE_INTEGER
  originalError.apply(originalError, args);
}

function formatLog(args) {
  return args.join(' ')
    .replace(/</g, '&lt;')
    .replace(/\n/g, '<br/>')
    .replace(/[\t\s]/g, '&nbsp;');
}

function clear() {
    htmlLog.innerHTML = '';
}

module.exports = {
  clear
};
