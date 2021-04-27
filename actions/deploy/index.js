#!/usr/bin/env node

require('colors');
const path = require('path');
const fs = require('fs');

const availableTasks = {
    upload: require('./task.upload'),
    command: require('./task.command'),
    clear: require('./task.clear'),
}

module.exports = function(rootPath) {
    return Promise
        .resolve(path.join(rootPath, 'deploy.config.js'))
        .then(configPath => {
            if (!fs.existsSync(configPath)) throw new Error('Config file not found');
            return require(configPath);
        })
        .then(config => {
            if (!config.tasks || config.tasks.length == 0) throw new Error('No tasks');

            let promise = Promise.resolve()
            config.tasks.forEach(taskConfig => {
                if (!availableTasks[taskConfig.name]) return;
                const task = availableTasks[taskConfig.name];

                promise = promise.then(() => {
                    return task
                        .onInit(config, taskConfig)
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
        })
}