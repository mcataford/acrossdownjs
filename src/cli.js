import { readFileSync, writeFileSync } from 'fs'

import Parser from './core'

const [puzPath, outpath] = process.argv.slice(2, 4)

const content = readFileSync(puzPath, { encoding: 'latin1' })
const parsed = new Parser({ verbose: true }).parse(content)

if (!outpath) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(parsed.toJSON(), null, 2))
} else {
    writeFileSync(outpath, JSON.stringify(parsed))
}
