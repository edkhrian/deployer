#!/usr/bin/env node

require('colors');
const args = process.argv.slice(2);
const action = args[0];
const availableActions = ['init', 'deploy'];

if (!availableActions.includes(action)) {
    console.log(`Available actions: ${availableActions.join(', ')}`.red)
    return;
}

const rootFolder = process.cwd();

switch(action) {
    case 'init':
        require('./action.init')(rootFolder);
        break;
    case 'deploy':
        require('./action.deploy')(rootFolder);
        break;
}

