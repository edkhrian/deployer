const path = require('path');
const FTPS = require('ftps');

let ftps;

module.exports = {
    onInit(project, data) {
        ftps = new FTPS({
            host: project.host,
            port: '22',
            username: project.username,
            password: project.password,
            protocol: 'sftp',
            autoConfirm: true
        });
        return Promise.resolve();
    },
    onRun(taskData) {
        return new Promise((resolve, reject) => {
            let srcList = typeof taskData.src == 'string' ? [taskData.src] : taskData.src;
            srcList.forEach((relativePath) => {
                const localDir = path.join(process.cwd(), relativePath);
                ftps = ftps.mirror({
                    remoteDir: taskData.dest,
                    localDir: localDir,
                    parallel: true,
                    upload: true,
                    filter: taskData.filter,
                    options: '--verbose=2 --overwrite'
                })
            });
            ftps
                .exec((err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }
                })
                .stdout.on('data', function (res) {
                    console.log(String(res).trim());
                })
        })
    },
    onDestroy() {
        return Promise.resolve();
    }
}