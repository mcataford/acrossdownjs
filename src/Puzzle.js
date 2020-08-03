class Puzzle {
    constructor(width, height, author, clues, layout, solution) {
        this.width = width
        this.height = height
        this.author = author
        this.clues = clues
        this.layout = layout
        this.solution = solution
    }

    getAuthorDetails() {
        return this.author
    }

    getCell(x, y) {
        return this.layout[y][x]
    }

    getDimensions() {
        return { width: this.width, height: this.height }
    }

    getClueCount() {
        return this.clues.across.length + this.clues.down.length
    }

    getAcrossClues() {
        return {...this.clues.across}
    }

    getDownClues() {
        return {...this.clues.down}
    }

    toJSON() {
        return {
            width: this.width,
            height: this.height,
            author: this.author,
            clues: this.clues,
            layout: this.layout,
            solution: this.solution,
        }
    }
}

export default Puzzle
