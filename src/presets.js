const commonTags = require('common-tags');

const { update: updateEditor } = require('./editor');

const select = document.getElementById('sel-preset');

const setup = function setup() {
    const keys = Object.keys(presets);
    select.innerHTML = keys.map(key => `<option value="${toId(key)}">${key}</option>`).join('\n');
}

const toId = function toId(name) {
    return name.replace(/[ ']/g, '-').toLowerCase();
}

const load = function load() {
    const selected = Object.keys(presets).find(key => toId(key) == select.value);
    updateEditor(presets[selected]);
}

module.exports = {
    setup,
    load
};

const presets = {
    "Conway's Game of Life": commonTags.stripIndent`
        /*
        https://goo.gl/Uys8G6

        Rules
        The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, or "populated" or "unpopulated" (the difference may seem minor, except when viewing it as an early model of human/urban behaviour simulation or how one views a blank space on a grid). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

        * Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
        * Any live cell with two or three live neighbours lives on to the next generation.
        * Any live cell with more than three live neighbours dies, as if by overpopulation.
        * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

        The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick (in other words, each generation is a pure function of the preceding one). The rules continue to be applied repeatedly to create further generations.
        */
    `,
    "Kata02: Karate Chop": commonTags.stripIndent`
        /*
        http://codekata.com/kata/kata02-karate-chop/

        Binary searches
        */
    `,
    "Kata04: Data Munging": commonTags.stripIndent`
        /*
        http://codekata.com/kata/kata04-data-munging/

        Real world data munging
        */
    `,
    "Kata05: Bloom Filters": commonTags.stripIndent`
        /*
        http://codekata.com/kata/kata05-bloom-filters/
        */
    `,
    "Kata06: Anagrams": commonTags.stripIndent`
        /*
        http://codekata.com/kata/kata06-anagrams/
        */
    `,
    "Kata08: Conflicting Objectives": commonTags.stripIndent`
        /*
        http://codekata.com/kata/kata08-conflicting-objectives/
        */
    `,
    "Kata21: Simple Lists": commonTags.stripIndent`
        /*
        http://codekata.com/kata/kata21-simple-lists/

        Possible tests (in ruby):
            list = List.new
            assert_nil(list.find("fred"))
            list.add("fred")
            assert_equal("fred", list.find("fred").value())
            assert_nil(list.find("wilma"))
            list.add("wilma")
            assert_equal("fred",  list.find("fred").value())
            assert_equal("wilma", list.find("wilma").value())
            assert_equal(["fred", "wilma"], list.values())

            list = List.new
            list.add("fred")
            list.add("wilma")
            list.add("betty")
            list.add("barney")
            assert_equal(["fred", "wilma", "betty", "barney"], list.values())
            list.delete(list.find("wilma"))
            assert_equal(["fred", "betty", "barney"], list.values())
            list.delete(list.find("barney"))
            assert_equal(["fred", "betty"], list.values())
            list.delete(list.find("fred"))
            assert_equal(["betty"], list.values())
            list.delete(list.find("betty"))
            assert_equal([], list.values())
        */
    `
};
