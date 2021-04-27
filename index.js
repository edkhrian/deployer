require('colors');
const args = process.argv.slice(2);
const actionName = args[0];

const actions = {
    'init': require('./actions/init'),
    'deploy': require('./actions/deploy')
}

if (actions[actionName]) {
    const rootFolder = process.cwd();
    actions[actionName](rootFolder)
        .then(() => {
            console.log(`Action «${actionName}» has completed`.green);
        })
        .catch(e => {
            console.log(`Error: ${e.message}`.red)
        })
} else {
    console.log(`Invalid action name. Available actions: ${Object.keys(actions).join(', ')}`.red)
}
