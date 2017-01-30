const commonTags = require('common-tags');
const debounce = require('lodash.debounce');

const { getUrlParams, save } = require('./persistence');
const { run } = require('./run');

const setup = function setup() {
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
}

module.exports = {
    setup
};
