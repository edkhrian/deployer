#!/usr/bin/env node

const util = require('util');
const log = require('fancy-log')
const gulp = require('gulp');
const GulpSSH = require('gulp-ssh');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const path = require('path');
const Client = require('ssh2-sftp-client');

const config = require('./config');

util.inspect.styles.date = 'grey';

const gulpSSH = new GulpSSH({
    sshConfig: { ...config.credentials }
});

gulp.task('deploy', () => {
    const tasks = config.tasks.map(task => {
        switch(task.name) {
            case 'upload':
                return function() {
                    task.src = Array.isArray(task.src) ? task.src : [task.src];

                    return gulp
                        .src(task.src)
                        .pipe(gulpSSH.dest(task.dest));
                };
            case 'run':
                return function() {
                    return gulpSSH.shell(task.commands);
                    // TODO show result in console
                };
            case 'delete':
                return async () => {
                    const client = new Client();

                    await client.connect({ ...config.credentials });

                    task.src = Array.isArray(task.src) ? task.src : [task.src];

                    const sources = task.src
                        .map((src) => {
                            if (/\.\w+$/.test(src)) {
                                let pattern;
                                const path = src.replace(/[^\/]+\.\w+$/, (str) => {
                                    pattern = str;
                                    return '';
                                });
                                return { path, pattern}
                            }
                            // directory
                            const match = src.match(/^([^*]+)(.*)$/);
                            return match[1] ? { path: match[1], pattern: match[2] || undefined } : null;
                        })
                        .filter(item => !!item);

                    let removeFiles = [];
                    await Promise.all(sources.map(async item => {
                        let files = await client.list(item.path, item.pattern);

                        if (task.test) {
                            files = files.filter(file => task.test(file));
                        }
                        files = files.map(file => path.join(item.path, file.name));

                        removeFiles = removeFiles.concat(files);
                    }));

                    await Promise.all(removeFiles.map(async filePath => {
                        await client.delete(filePath);
                        log(`Deleted: ${filePath}`);
                    }));

                    return client.end();
                }
        }
    })
    return gulp.series(tasks)();
});

gulp.task('init', () => {
    const tasks = [
        () => {
            return gulp.src(path.join(config.projectPath, '.gitignore'), { allowEmpty: true })
                .pipe(replace(/$/, function (match) {
                    if (this.file.contents.toString().includes('@edunse/deployer')) return match;
                    return '\n\n# @edunse/deployer\ndeploy.credentials.js';
                }))
                .pipe(gulp.dest(config.projectPath));
        },
        () => {
            return gulp.src(path.join(__dirname, './templates/**'))
                .pipe(rename((path) => {
                    if (path.basename == 'gitignore') {
                        path.basename = '.' + path.basename;
                    }
                }))
                .pipe(gulp.dest(config.projectPath, { overwrite: false }));
        }
    ];
    return gulp.parallel(tasks)();
});

gulp.task(config.actionName)();

process.on('uncaughtException', function(err) {
    if (err.context && err.context.error) {
        console.log('Error: ' + err.context.error.message);
    } else {
        console.log(err);
    }
    process.exit(0);
});