const minimist = require('minimist')
const fs = require('fs')

module.exports = (args = process.argv) => {
  execute(getInputs(args))
}

function getInputs(args) {
  return minimist(args.slice(2))
}

function execute(inputs) {
  if (inputs.help || inputs.h) return require('./cmd/help')(inputs)
  if (inputs.version || inputs.v) return require('./cmd/version')()

  fs.readdir('./cmd', (err, files) => {
    if (err) throw new Error('Unable to find command plugin')
    const command = inputs._[0]
    if (files.includes(command)) return require(`./cmd/${command}`)(inputs)
    return require('./cmd/help')(inputs)
  })
}
