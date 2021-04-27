# Deployer

[![NPM][npm-icon]][npm-url]

It mainly used by myself to deploy express.js servers or Angular 2+ projects (Angular Universal as well), but you can use it for a lot of things. This repo allows you to deploy files on server, remove old files (e.g. old angular hashed bundles, which you don't need after deploying new ones), restart a server (e.g. Angular Universal server) by running command line commands and other cool stuff.

## Install
```bash
npm install --save-dev @edunse/deployer
```

## Setup

To make it easy, there is a command to initialize an environment on first setup: 
```bash
deployer init
```

What it makes:
1. Creates an empty config file in root directory (the file name is **deploy.config.js**);
2. Adds a deployment script to package.json (to make a deployment with **npm run deploy**);
3. Adds a config file to .gitignore (because it's bad to push username/password to a repository).

Right after the initialization your config file will be located in root directory. You should change the content of it for your own purposes.

## Example of config

```javascript
module.exports = {
    host: 'XXX.XXX.XXX.XXX', // host ip or domain
    username: 'root',
    password: 'root_password',
    // list of tasks, they will be running in presented order one after another
    // there is 3 types of tasks available: upload, clear, command
    tasks: [
        {
            name: 'upload',
            src: './dist/browser',
            dest: '/home/browser',
        },
        {
            name: 'upload',
            src: [
                './dist/style',
                './dist/assets'
            ],
            dest: '/home/browser/assets',
        },
        {
            name: 'clear', // remove files on the server
            filesOlder: 24 * 3600 * 1000, // optional, files older than the value (milliseconds)
            dest: '/home/browser/', // in the remote folder
            fileTest: /\.(js|css)$/, // optional, check this regexp to file names which should be removed
        },
        {
            name: 'command', // run a command
            src: '/home/server', // optional, will go to the folder before running the command
            command: 'pm2 restart server', // result of this command will be shown in console
        }
    ]
};
```

## Usage

To execute tasks in a config file, run the command:
```bash
deployer deploy
```
or if you initialized an environment:
```bash
npm run deploy
```


[npm-url]: https://www.npmjs.com/package/@edunse/deployer
[npm-icon]: https://img.shields.io/npm/v/@edunse/deployer.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen