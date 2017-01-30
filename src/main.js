const chai = require('chai');
const commonTags = require('common-tags');
const debounce = require('lodash.debounce');

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
const formatLog = function format(args) {
  return args.join(' ')
    .replace(/</g, '&lt;')
    .replace(/\n/g, '<br/>')
    .replace(/[\t\s]/g, '&nbsp;');
}

const getUrlParams = function getUrlParams(query) {
  return query.substring(1).split('&').reduce((akku, part) => { const parts = part.split('='); akku[parts[0]] = decodeURIComponent(parts[1]); return akku; }, {});
}

const createUrl = function createUrl(opts) {
  return `${location.pathname}?code=${encodeURIComponent(opts.code || '')}&grep=${encodeURIComponent(opts.grep || '')}`;
}

const save = function save(code) {
  const url = createUrl({
    code,
    grep: getUrlParams(location.search).grep
  })
  history.replaceState(undefined, undefined, url);
}

const updateIndicator = function updateIndicator(failures) {
  const indicatorLabels = document.querySelectorAll('.side .side-headline');
  if (failures === 0) {
    indicatorLabels.forEach(label => {
      label.classList.remove('fail');
      label.classList.add('success');
    });
  } else {
    indicatorLabels.forEach(label => {
      label.classList.remove('success');
      label.classList.add('fail');
    });
  }
}

const mochaFrame = document.getElementById('mochaFrame');
const runInSandbox = function runInSandbox(code) {
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
const run = function run(current) {
  if (current != last) {
    last = current;
    runInSandbox(current);
  }
}

module.exports = function main() {
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true
  });
  monaco.languages.typescript.javascriptDefaults.addExtraLib('declare var win: typeof window;', 'win-global.d.ts');
  monaco.languages.typescript.javascriptDefaults.addExtraLib('declare var doc: typeof document;', 'doc-global.d.ts');
  // add mocha.d.ts
  fetch('node_modules/@types/mocha/index.d.ts')
    .then(response => response.text())
    .then(text => {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(text, 'mocha.d.ts');
    });
  // add chai.d.ts
  fetch('node_modules/@types/chai/index.d.ts')
    .then(response => response.text())
    .then(text => {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(text, 'chai.d.ts');
    });
  monaco.languages.typescript.javascriptDefaults.addExtraLib('declare var expect: typeof chai.expect;', 'chai-global.d.ts');

  const editor = monaco.editor.create(document.getElementById('code'), {
    value: getUrlParams(location.search).code || commonTags.stripIndent`
      // Global variables:
      // * doc - the top-level document
      // * win - the top-level window
      //
      // So for example:
      // doc.getElementById('playground') // will return the right side div
      // win.location.reload() // will reload the entire playground
      //
      const add = (a, b) => a + b;

      describe('add',() => {
        it('should return the sum of 1 and 2', () => {
          expect(add(1, 2)).to.equal(2);
        });
      });
    `,
    language: 'javascript'
  });
  // Save shortcut
  editor.addAction({
    id: 'save',
    label: 'Save',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
    keybindingContext: null,
    run: function (ed) {
      save(ed.getModel().getValue());
      return null;
    }
  });
  editor.focus();
  run(editor.getModel().getValue());

  editor.getModel().onDidChangeContent(debounce(() => {
    const code = editor.getModel().getValue();
    save(code);
    run(code);
  }, 200));

  document.getElementById('btn-reset').addEventListener('click', e => {
    location.href = location.pathname;
  });
  let interval;
  let timeout;
  document.getElementById('btn-timer').addEventListener('click', e => {
    if (timeout) {
      clearTimeout(timeout);
      document.getElementById('btn-timer').innerHTML = 'Start Timer';
      timeout = undefined;
      clearInterval(interval);
      interval = undefined;
    } else {
      const timer = prompt('How long to set a timer (in minutes)?', '45');
      if (timer) {
        const timerms = parseInt(timer, 10) * 60 * 1000;
        const start = new Date().getTime();
        interval = setInterval(() => {
          const now = new Date().getTime();
          const timeout = (timerms - (now - start)) / 1000;
          document.getElementById('btn-timer').innerHTML =
            `Clear Timer ${parseInt(timeout / 60, 10)}:${parseInt(timeout % 60, 10)}`;
        }, 1000);
        timeout = setTimeout(() => {
          alert('Time out');
          document.getElementById('btn-timer').innerHTML = 'Start Timer';
          timeout = undefined;
          clearInterval(interval);
          interval = undefined;
        }, timerms);
      }
    }
  });
  document.getElementById('btn-clear').addEventListener('click', e => {
    htmlLog.innerHTML = '';
  });
  document.getElementById('btn-fullscreen').addEventListener('click', e => {
    if (document.isFullScreen || document.webkitIsFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
      }
    }
  });
};
