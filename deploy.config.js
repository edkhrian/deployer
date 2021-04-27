module.exports = {
    host: '',
    username: '',
    password: '',
    tasks: [
        {
            name: 'upload',
            src: [
                './path/to/dist',
            ],
            dest: '/path/to/remote/folder'
        },
        {
            name: 'clear',
            filesOlderHours: 24,
            dest: '/path/to/remote/folder',
            fileTest: /\.(js|css)$/
        },
        {
            name: 'command',
            commandFolder: '/path/to/remote/folder',
            command: 'pm2 restart server'
        }
    ]
};