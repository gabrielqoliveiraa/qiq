import yargs from 'yargs';

// export const argv = yargs
//   .commandDir('commands', {recurse: true, extensions: ["ts"]})
//   .wrap(null)
//   .alias("help", "h")
//   .version(false)
//   .demandCommand()
//   .help()
//   .argv


require('yargs/yargs')(process.argv.slice(2))
  .commandDir('commands', {recurse: true, extensions: ["ts"]})
  .demandCommand()
  .help()
  .argv






