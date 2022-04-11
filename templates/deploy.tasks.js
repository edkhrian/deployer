module.exports = [
    {
        name: 'upload',
        src: [
            './path/to/dist',
        ],
        dest: '/path/to/remote/folder',
        // fileTest: /test.js/
    },
    {
        name: 'delete',
        src: '/path/to/remote/folder/*.js',
        filesOlder: 24 * 3600 * 1000, // optional
        // fileTest: /\.(js|css)$/ // optional
    },
    {
        name: 'run',
        commands: [
            'pm2 restart server'
        ]
    }
];