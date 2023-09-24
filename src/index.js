const yargs = require('yargs');


yargs(process.argv.slice(2))
  .commandDir('commands', {recurse: true, extensions: ["js"]})
  .demandCommand()
  .help()
  .argv








