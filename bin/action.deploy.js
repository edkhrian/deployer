#!/usr/bin/env node

require('colors');
const path = require('path');
const fs = require('fs');

const tasks = {
    upload: require('./task.upload'),
    command: require('./task.command'),
    clear: require('./task.clear'),
}

module.exports = function(rootPath) {
    const configPath = path.join(rootPath, 'deploy.config.js');
    if (!fs.existsSync(configPath)) {
        console.log('Config file not found'.red);
        process.exit();
    }
    const configFile = require(configPath);

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
}