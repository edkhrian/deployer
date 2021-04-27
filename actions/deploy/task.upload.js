const path = require('path');
const FTPS = require('ftps');

module.exports = {
    onInit(config, data) {
        this.ftps = new FTPS({
            host: config.host,
            port: '22',
            username: config.username,
            password: config.password,
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
                // .stdout.on('data', function (res) {
                //     console.log(String(res).trim());
                // })
        })
    },
    onDestroy() {
        return Promise.resolve();
    }
}