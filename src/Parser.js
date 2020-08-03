import Puzzle from './Puzzle'
import {
    BODY_OFFSET,
    GRID_EXTRA_MARKER,
    HEIGHT_OFFSET,
    NUL_MARKER,
    WIDTH_OFFSET,
} from './constants'

class PuzzleParser {
    constructor({ verbose = false } = {}) {
        this.verbose = verbose
    }

    _processHeader(headerBytes) {
        const width = headerBytes.charCodeAt(WIDTH_OFFSET)
        const height = headerBytes.charCodeAt(HEIGHT_OFFSET)

        const headerData = { height, width }
        if (this.verbose) {
            console.debug('[header]', headerData)
            console.debug('[header]', Array(headerBytes))
        }
        return headerData
    }

    _processBody(bodyBytes, width, height) {
        const rowRegexp = new RegExp(`.{${width}}`, 'g')
        const solutionsLength = width * height
        const layoutOffsetEnd = solutionsLength * 2
        const solutionsString = bodyBytes
            .slice(0, solutionsLength)
            .match(rowRegexp)
        const layoutString = bodyBytes
            .slice(solutionsLength, solutionsLength * 2)
            .match(rowRegexp)
        const cluesString = bodyBytes
            .slice(solutionsLength * 2)
            .split(NUL_MARKER)
        const authors = cluesString.slice(0, 3)
        const clues = cluesString.slice(3)
        const annotatedLayout = this._deriveClueAssignment(layoutString)
        const annotatedClues = this._categorizeClues(annotatedLayout, clues)

        return {
            solutions: solutionsString,
            annotatedLayout,
            annotatedClues,
            authors,
        }
    }

    parse(data) {
        const headerBytes = data.slice(0, BODY_OFFSET)
        const bodyBytes = data.slice(BODY_OFFSET)
        const { width, height } = this._processHeader(headerBytes)
        const {
            authors,
            annotatedClues,
            annotatedLayout,
            solutions,
        } = this._processBody(bodyBytes, width, height)
        return new Puzzle(
            width,
            height,
            authors,
            annotatedClues,
            annotatedLayout,
            solutions,
        )
    }

    _deriveClueAssignment(grid) {
        let currentClue = 1

        return grid.reduce((annotatedGrid, row, rowIndex) => {
            const currentRow = row
                .split('')
                .reduce((annotatedRow, cell, cellIndex) => {
                    if (cell === '.') return [...annotatedRow, null]

                    const leftNeighbour =
                        cellIndex > 0 ? annotatedRow[cellIndex - 1] : null
                    const upNeighbour =
                        rowIndex > 0
                            ? annotatedGrid[rowIndex - 1][cellIndex]
                            : null

                    const annotation = {}

                    if (leftNeighbour === null) annotation.across = currentClue
                    else
                        annotation.acrossGroup =
                            leftNeighbour?.across || leftNeighbour?.acrossGroup

                    if (upNeighbour === null) annotation.down = currentClue
                    else
                        annotation.downGroup =
                            upNeighbour?.down || upNeighbour?.downGroup

                    if (annotation.across || annotation.down) currentClue++

                    return [...annotatedRow, annotation]
                }, [])

            return [...annotatedGrid, currentRow]
        }, [])
    }

    _categorizeClues(annotatedGrid, clues) {
        const across = {}
        const down = {}
        let currentClue = clues.shift()

        annotatedGrid.forEach(row => {
            row.forEach(cell => {
                if (!cell) return

                if (cell.across) {
                    across[cell.across] = currentClue
                    currentClue = clues.shift()
                }

                if (cell.down) {
                    down[cell.down] = currentClue
                    currentClue = clues.shift()
                }
            })
        })

        return { across, down }
    }
}

export default PuzzleParser
