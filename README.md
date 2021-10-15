# Deployer

[![NPM][npm-icon]][npm-url]

It mainly used by myself to deploy express.js servers or Angular 2+ projects (Angular Universal as well), but you can use it for a lot of things. This repo allows you to deploy files on server, remove old files (e.g. old angular hashed bundles, which you don't need after deploying new ones), restart a server (e.g. Angular Universal server) by running command line commands and other cool stuff.

## Install
Just install this module globally:
```bash
npm install -g @edunse/deployer
```

## Setup

To make a config process easier, there is a command to initialize an environment on first setup: 
```bash
cd /home/myproject # first navigate to your project folder
deployer init # then run the initialization
```

What it makes:
1. Creates empty config files in the root directory (**deploy.config.js** and **deploy.credentials.js**);
2. Adds the credential config file name to .gitignore (because it's bad to push username/password to a repository);
2. Adds a deployment script to package.json (to make a deployment with **npm run deploy** script).

Right after the initialization your config files will be located in the root directory. You should change their content to your own purposes.

## Example of deploy.config.js

```javascript
module.exports = {
    // multiple projects can be set and deployed later separately
    projects: {
        default: [
            // list of tasks, they will be running in the presented order one after another
            // there is 3 types of tasks available: upload, clear, command
            {
                name: 'upload',
                src: './dist/browser',
                dest: '/home/browser',
                fileTest: /server.js/, // optional, RegExp to test files for uploading
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
                dest: '/home/browser', // in the remote folder
                filesOlder: 24 * 3600 * 1000, // optional, files older than the value (milliseconds)
                fileTest: /\.(js|css)$/, // optional, RegExp to test files for removing
            },
            {
                name: 'command', // run a command
                src: '/home/server', // optional, will go to the folder before running the command
                command: 'pm2 restart server', // result of this command will be shown in console
            }
        ]
    }
};
```

## Example of deploy.credentials.js
```javascript
module.exports = {
    host: 'XXX.XXX.XXX.XXX', // host ip or domain
    username: 'root',
    password: 'root_password',
}
```
## Usage

To execute tasks in a config file for specific project (if a project name is omitted and there is only one project in config file then that project will be used), run the command:
```bash
deployer deploy [project name]
```
or if you initialized an environment:
```bash
npm run deploy
```


[npm-url]: https://www.npmjs.com/package/@edunse/deployer
[npm-icon]: https://img.shields.io/npm/v/@edunse/deployer.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen