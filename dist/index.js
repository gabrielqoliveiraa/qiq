const yargs = require('yargs');
yargs.command({
    command: 'hello',
    describe: 'Diz olá ao mundo',
    handler: function () {
        console.log('Olá, mundo!');
    },
});
yargs.argv;
