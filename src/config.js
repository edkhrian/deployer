const path = require('path');
const fs = require('fs');

const arguments = process.argv.slice(2);
const availableActions = ['deploy', 'init'];

const config = {
    projectPath: process.cwd(),
    actionName: arguments.shift(),
    credentials: null,
    tasks: null,
};

try {
    if (!availableActions.includes(config.actionName)) {
        throw new Error(`Invalid action name. Available actions: ${availableActions.join(', ')}`)
    }

    const credentialsPath = path.join(config.projectPath, 'deploy.credentials.js');
    if (!fs.existsSync(credentialsPath)) throw new Error('Credentials file not found');
    config.credentials = require(credentialsPath);

    if (!config.credentials.host) throw new Error('No host');
    if (!config.credentials.username) throw new Error('No username');
    if (!config.credentials.password) throw new Error('No password');

    if (config.actionName == 'deploy') {
        const tasksPath = path.join(config.projectPath, 'deploy.tasks.js');
        if (!fs.existsSync(tasksPath)) throw new Error('Tasks file not found');
        let tasksData = require(tasksPath);
        if (Array.isArray(tasksData)) {
            tasksData = { default: tasksData };
        }
        const tasksName = arguments[0] || Object.keys(tasksData)[0];
        if (!tasksData[tasksName]) throw new Error(`Tasks «${tasksName}» not found`);

        config.tasks = tasksData[tasksName];

        // TODO validate tasks (check src, dest
    }
} catch(e) {
    console.error(e.message);
    process.exit(0);
}

module.exports = config;