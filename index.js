require('colors');
const arguments = process.argv.slice(2);
const actionName = arguments.shift();

const actions = {
    'init': require('./actions/init'),
    'deploy': require('./actions/deploy')
}
const action = actions[actionName];
if (!action) {
    console.log(`Invalid action name. Available actions: ${Object.keys(actions).join(', ')}`.red);
    process.exit();
}

action(arguments)
    .then(() => {
        console.log(`Action «${actionName}» has completed`.green);
    })
    .catch(e => {
        console.log(`Error: ${e.message}`.red)
    })
