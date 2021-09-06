const path = require('path');
const FTPS = require('ftps');

module.exports = {
    onInit(credentials) {
        this.ftps = new FTPS({
            host: credentials.host,
            port: '22',
            username: credentials.username,
            password: credentials.password,
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
                this.ftps = this.ftps.mirror({
                    remoteDir: taskData.dest,
                    localDir: localDir,
                    parallel: true,
                    upload: true,
                    filter: taskData.filter,
                    options: '--verbose=2 --overwrite'
                })
            });
            this.ftps
                .exec((err, response) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(response);
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