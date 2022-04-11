#!/usr/bin/env node

const gulp = require('gulp');
const GulpSSH = require('gulp-ssh');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const path = require('path');
const fs = require('fs');

const config = require('./src/config');

const gulpSSH = new GulpSSH({
    sshConfig: { ...config.credentials }
});

gulp.task('deploy', () => {
    const tasks = config.tasks.map(task => {
        switch(task.name) {
            case 'upload':
                return function() {
                    task.src = Array.isArray(task.src) ? task.src : [task.src];
                    task.src = task.src.map(value => path.join(config.projectPath, value))
                    return gulp
                        .src(task.src)
                        .pipe(gulpSSH.dest(task.dest))
                };
            case 'run':
                return function() {
                    return gulpSSH.exec(task.command);
                };
            case 'delete':
                // TODO

                break;
        }
    })
    return gulp.series(tasks)();
});

gulp.task('init', () => {
    const tasks = [
        () => {
            return gulp.src(path.join(config.projectPath, '.gitignore'), { allowEmpty: true })
                .pipe(replace(/$/m, function (match) {
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