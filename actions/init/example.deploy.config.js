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
            filesOlder: 24 * 3600 * 1000, // optional
            dest: '/path/to/remote/folder',
            fileTest: /\.(js|css)$/ // optional
        },
        {
            name: 'command',
            src: '/path/to/remote/folder/to/run/command/in', // optional
            command: 'pm2 restart server'
        }
    ]
};