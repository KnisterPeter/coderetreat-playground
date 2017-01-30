const chai = require('chai');

const { getUrlParams, createUrl } = require('./persistence');
const { updateIndicator } = require('./ui');

const mochaFrame = document.getElementById('mochaFrame');
function runInSandbox(code) {
  const mochaWindow = mochaFrame.contentWindow;
  // Reset sandbox
  mochaWindow.location.reload();
  setTimeout(() => {
    mochaWindow.console.log = console.log;
    mochaWindow.console.error = console.error;
    const mochaDocument = mochaFrame.contentDocument;
    mochaDocument.head.innerHTML = `<link rel="stylesheet" href="node_modules/mocha/mocha.css">`;
    mochaDocument.body.innerHTML = `<div id="mocha"></div>`;
    mochaDocument.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.tagName === 'A') {
        const a = document.createElement('a');
        a.href = e.target.href;
        const mochaParams = getUrlParams(a.search);
        const url = createUrl({
          code: getUrlParams(location.search).code,
          grep: mochaParams.grep
        });
        history.replaceState(undefined, undefined, url);
        runInSandbox(getUrlParams(location.search).code);
      }
    });
    const script = mochaDocument.createElement('script');
    script.src = 'node_modules/mocha/mocha.js';
    script.onload = () => {
      try {
        mochaWindow.win = window;
        mochaWindow.doc = document;
        mochaWindow.expect = chai.expect;

        mochaWindow.mocha.setup('bdd');
        mochaWindow.eval(code);
        mochaWindow.mocha.checkLeaks();
        mochaWindow.mocha.grep(getUrlParams(location.search).grep);
        mochaWindow.mocha.run(failures => {
          updateIndicator(failures);
        });
      } catch (e) {
        console.error(e.stack);
        updateIndicator(1);
      }
    };
    mochaDocument.body.appendChild(script);
  }, 0);
}

let last = undefined;
function run(current) {
  if (current != last) {
    last = current;
    runInSandbox(current);
  }
}

module.exports = {
    run
};
