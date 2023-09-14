import yargs from 'yargs';

const argv = yargs
  .commandDir('commands', {recurse: true, extensions: ["ts"]})
  .demandCommand(1, 'Você precisa fornecer pelo menos um comando.')
  .help().argv;





