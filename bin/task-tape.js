#!/usr/bin/env node

var program = require('commander')

program
  .version(require('../package.json').version)
  .option('-b --babel', 'tape babel code', false)
  .parse(process.argv)

if (program.babel) {
  require('babel-core/register')
}
require('..')
require('tape/bin/tape')
