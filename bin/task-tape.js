#!/usr/bin/env node

var program = require('commander')

program
  .version(require('../package.json').version)
  .option('-b, --babel', 'tape babel code', false)
  .parse(process.argv)

var resolve = require('resolve')
var hookRequire = require('../lib/hookRequire')
var tape = require(
  resolve.sync('tape', { basedir: process.cwd() })
)
hookRequire(tape)

if (program.babel) {
  require(
    resolve.sync('babel-core/register', { basedir: process.cwd() })
  )
}

var path = require('path')
var glob = require('glob')

program.args.forEach(function (arg) {
  glob(arg, function (err, files) {
    files.forEach(function (file) {
      require(path.resolve(file))
    })
  })
})

