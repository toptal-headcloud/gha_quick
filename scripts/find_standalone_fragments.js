#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const MAX_DEPTH = 50
var deepestLevel = 0

const skipDirs = ['node_modules', 'coverage', 'dist']

const getAllFiles = function (dirPath, arrayOfFiles, depth) {
  if (depth > MAX_DEPTH) {
    return arrayOfFiles
  }
  const currentDepth = depth + 1

  deepestLevel = Math.max(deepestLevel, currentDepth)
  const files = fs.readdirSync(dirPath)
  const currentDirFilesCount = files.length

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (skipDirs.some(x => x === file)) {
      console.log(`vv: skipping ${file}`)

      return
    }

    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(
        dirPath + '/' + file,
        arrayOfFiles,
        currentDepth
      )
    } else {
      if (file.indexOf('ragment.ts') >= 0 && currentDirFilesCount <= 2) {
        arrayOfFiles.push(path.join(dirPath, '/', file))
      }
    }
  })

  return arrayOfFiles
}

const pArgs = process.argv.slice(2)
const startDir = path.resolve(pArgs[0]) || process.cwd()
console.log(startDir)
const result = getAllFiles(startDir, [], 0)

console.log(result)
console.log(`vv: deepest level reached ${deepestLevel}`)
