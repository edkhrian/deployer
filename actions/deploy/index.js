#!/usr/bin/env node

require('colors');
const path = require('path');
const fs = require('fs');

const availableTasks = {
    upload: require('./task.upload'),
    command: require('./task.command'),
    clear: require('./task.clear'),
}
const rootPath = process.cwd();

module.exports = async function(arguments) {
    const credentialsPath = path.join(rootPath, 'deploy.credentials.js');
    if (!fs.existsSync(credentialsPath)) throw new Error('Credentials file not found');
    const credentials = require(credentialsPath);
    if (!credentials.host) throw new Error('No host in credentials');
    if (!credentials.username) throw new Error('No username in credentials');
    if (!credentials.password) throw new Error('No password in credentials');

    const configPath = path.join(rootPath, 'deploy.config.js');
    if (!fs.existsSync(configPath)) throw new Error('Config file not found');
    const config = require(configPath);

    const projectNames = Object.keys(config.projects || {});
    const projectName = arguments[0] || (projectNames.length == 1 ? projectNames[0] : null);

    if (!config.projects[projectName]) {
        throw new Error(`Project «${projectName}» not found`);
    }
    const tasks = config.projects[projectName];
    if (tasks.length == 0) throw new Error('No tasks');

    let promise = Promise.resolve()
    tasks.forEach(taskConfig => {
        const task = availableTasks[taskConfig.name];
        if (!task) return;

        promise = promise.then(() => {
            return task
                .onInit(credentials)
                .then(() => {
                    console.log(`Task «${taskConfig.name}» initialized`.green);
                    return task.onRun(taskConfig)
                })
                .then(() => {
                    console.log(`Task «${taskConfig.name}» completed`.green);
                    return task.onDestroy(taskConfig)
                })
            // .then(() => {
            //     console.log(`Task «${taskConfig.name}» destroyed`.green);
            // })
        })
    })

    return promise;
}