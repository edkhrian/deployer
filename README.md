# Deployer

[![NPM][npm-icon]][npm-url]

It mainly used by myself to deploy express.js servers or Angular 2+ projects (Angular Universal as well), but you can use it for a lot of things. This repo allows you to deploy files on server, remove old files (e.g. old angular hashed bundles, which you don't need after deploying new ones), restart a server (e.g. Angular Universal server) by running command line commands and other cool stuff.

## Install
Just install this module globally:
```bash
npm install -g @edkhrian/deployer
```

## Setup

To make a config process easier, there is a command to initialize an environment on first setup: 
```bash
cd /home/myproject # first navigate to your project folder
deployer init # then run the initialization
```

What it makes:
1. Creates empty config files in the root directory (**deploy.tasks.js** and **deploy.credentials.js**);
2. Adds the credential config file name to .gitignore (because it's bad to push username/password to a repository);

Right after the initialization your config files will be located in the root directory. You should change their content to your own purposes.

## Example of deploy.config.js

```javascript
module.exports = [
    // list of tasks, they will be running in the presented order one after another
    // there are 3 types of tasks available: upload, delete, run
    {
        name: 'upload',
        src: [
            './dist/**/*',
            '!./dist/templates/**',
        ],
        dest: '/home/public'
    },
    {
        name: 'delete', // remove files on the server
        src: [
            '/home/public/*.js', // in the remote folder
        ],
        // optional, check which files to delete
        test: (file) => {
            return Date.now() - file.modifyTime > 24 * 3600 * 1000;
        }
    },
    {
        name: 'run', // run commands
        commands: [
            'cd /home/public',
            'pm2 restart server'
        ],
    }
];
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

To execute tasks from a config file run the command:
```bash
deployer deploy
```

[npm-url]: https://www.npmjs.com/package/@edkhrian/deployer
[npm-icon]: https://img.shields.io/npm/v/@edkhrian/deployer.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen