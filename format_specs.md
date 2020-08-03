# `puz` format specifications

## Foreword

The AcrossLite format is not publicly documented. This specification was built by probing dozens of `puz` files and is a living document that will be update as new sections of the format are figured out.

## Format

The `puz` file format is a binary blob with `latin1` encoding.

### Header

The header section is consistently 52 bytes long.

|Label|Start offset|Length (bytes)|Notes|
|:----|:----|:----|:----|
|Puzzle width|`0x2c`|1|Self-explanatory.|
|Puzzle height|`0x2d`|1|Self-explanatory.|

### Body

The body of the puzzle starts consistently at offset `0x34`.

|Label|Start offset|Length (bytes)|Notes|
|:----|:----|:----|:----|
|Solution|`0x34`|`width * height`|Based on the height and width, the solution is written out as ASCII.|
|Layout|(end of the solution)|`width * height`|The layout of the grid is defined with `.` used as "empty cell"|
|Clues|(end of the layout)|???|`NUL` separated strings containing each of the clues, not numbered.|

#### Clue numbering and tagging

The file doesn't contain information in which cells correspond to across and down clues. This information can be derived from the puzzle layout and the set of clues available:

```
FOREACH cell IN grid:
    IF cell has a non-empty top neighbour
    THEN the cell is part of its top neighbour's down word
    ELSE the cell is part of the next available down word

    IF cell as a non-empty left neighbour
    THEN the cell is part of its left neighbour's across word 
    ELSE the cell is part of the next available across word
```

By picking off clues from the across and down clue lists, assigning them using the algorithm above and numbering them as you go, you can build the correct cell <> clue mappings.
