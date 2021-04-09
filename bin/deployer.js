#!/usr/bin/env node

require('colors');
const path = require('path');
const fs = require('fs');
const args = process.argv.slice(2);

const availableActions = ['deploy'];
const action = args[0];

if (!availableActions.includes(action)) throw new Error('Available actions: ' + availableActions.join(', '));

const rootFolder = process.cwd();
const configPath = path.join(rootFolder, 'deploy.config.js');

if (!fs.existsSync(configPath)) {
    console.log('Config file not found'.red);
    process.exit();
}
const configFile = require(configPath);

const tasks = {
    upload: require('../task.upload'),
    command: require('../task.command'),
    clear: require('../task.clear'),
}

let globalPromise = Promise.resolve();

configFile.tasks.forEach((taskData) => {
    if (!tasks[taskData.name]) return;
    const task = tasks[taskData.name];

    globalPromise = globalPromise.then(() => {
        return task
            .onInit(configFile, taskData)
            .then(() => {
                console.log(`[${taskData.name}] initialized`.green);
                return task.onRun(taskData)
            })
            .then(() => {
                console.log(`[${taskData.name}] completed`.green);
                return task.onDestroy(taskData)
            })
            .then(() => {
                console.log(`[${taskData.name}] destroyed`.green);
            })
    })
});

globalPromise
    .catch(e => {
        console.error(e);
        process.exit();
    })
