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
