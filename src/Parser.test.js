import { readFileSync } from "fs";

import PuzzleParser from "./core";

describe("Puzzle Parser", () => {
  let puzzle;

  function getSamplePuzzle(identifier) {
    return readFileSync(__dirname + `/${identifier}.puz`, {
      encoding: "latin1"
    });
  }

  beforeEach(() => {
    puzzle = getSamplePuzzle("sampleGrid");
  });

  it("extracts puzzle dimensions", () => {
    const expectedHeight = 15;
    const expectedWidth = 15;

    const parsedPuzzle = new PuzzleParser().parse(puzzle);

    expect(parsedPuzzle.getDimensions()).toEqual({
      width: expectedWidth,
      height: expectedHeight
    });
  });

  it("extracts clues", () => {
    const parsedPuzzle = new PuzzleParser().parse(puzzle);

    expect(parsedPuzzle.getClueCount()).toMatchInlineSnapshot(`NaN`);
    expect(parsedPuzzle.getAcrossClues()).toMatchSnapshot();
    expect(parsedPuzzle.getDownClues()).toMatchSnapshot();
  });

  it("extracts author details", () => {
    const parsedPuzzle = new PuzzleParser().parse(puzzle);
    expect(parsedPuzzle.getAuthorDetails()).toMatchInlineSnapshot(`
Array [
  "Heard It Before?",
  "Stu Ockman",
  "© 2020, Andrews McMeel Syndication. Editor: David Steinberg.",
]
`);
  });

  it('parses puzzles', () => {
        const parsedPuzzle = new PuzzleParser().parse(puzzle)
      expect(parsedPuzzle.toJSON()).toMatchSnapshot()
  })

  it('annotates cell details', () => {
       const parsedPuzzle = new PuzzleParser().parse(puzzle)
      expect(parsedPuzzle.toJSON().layout[0][0]).toEqual(parsedPuzzle.getCell(0, 0))

  })

  it('dumps debug output if verbose flag is set', () => {
        const debugSpy = jest.spyOn(console, 'debug')
 const parsedPuzzle = new PuzzleParser({ verbose: true}).parse(puzzle)
      expect(debugSpy).toHaveBeenCalled()


  })
});
