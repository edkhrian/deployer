module.exports = [
    {
        name: 'upload',
        src: [
            './dist/**/*',
        ],
        dest: '/home/frontend'
    },
    {
        name: 'delete',
        src: [
            '/home/frontend/*.js', // no nesting
        ],
        // test: (file) => {
        //     return Date.now() - file.modifyTime > 24 * 3600 * 1000;
        // }
    },
    {
        name: 'run',
        commands: [
            'pm2 restart server'
        ]
    }
];