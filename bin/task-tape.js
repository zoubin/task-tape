#!/usr/bin/env node

var program = require('commander')

program
  .version(require('../package.json').version)
  .option('-b --babel', 'tape babel code', false)
  .parse(process.argv)

if (program.babel) {
  require('babel-core/register')
}

var resolve = require('resolve')
var hookRequire = require('../lib/hookRequire')
var tape = require(
  resolve.sync('tape', { basedir: process.cwd() })
)
hookRequire(tape)

var path = require('path')
var glob = require('glob')

program.args.forEach(function (arg) {
  glob(arg, function (err, files) {
    files.forEach(function (file) {
      require(path.resolve(file))
    })
  })
})

