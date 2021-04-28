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
            dest: '/path/to/remote/folder',
            filesOlder: 24 * 3600 * 1000, // optional
            fileTest: /\.(js|css)$/ // optional
        },
        {
            name: 'command',
            src: '/path/to/remote/folder/to/run/command/in', // optional
            command: 'pm2 restart server'
        }
    ]
};