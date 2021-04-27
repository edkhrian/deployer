require('colors');
const path = require('path');
const Client = require('ssh2-sftp-client');
const sftpClient = new Client();

module.exports = {
    onInit(project, data) {
        return sftpClient
            .connect({
                host: project.host,
                port: '22',
                username: project.username,
                password: project.password
            })
    },
    onRun(taskData) {
        return sftpClient
            .list(taskData.dest)
            .then((files) => {
                const oldFilesLimit = 1000 * 3600 * (taskData.filesOlderHours || 8);
                const now = Date.now();
                return files
                    .filter(file => {
                        const isValid = taskData.fileTest ? taskData.fileTest.test(file.name) : false;
                        return isValid && (now - file.modifyTime > oldFilesLimit)
                    })
                    .map(file => path.join(taskData.dest, file.name));
            })
            .then(removeFiles => {
                if (removeFiles.length == 0) return //console.log('Nothing to remove'.cyan);

                let promise = Promise.resolve();
                removeFiles.forEach(filePath => {
                    promise = promise.then(() => {
                        return sftpClient.delete(filePath)
                            .then(() => {
                                console.log(`Removed: ${filePath}`.cyan);
                            })
                    })
                    // return new Promise((resolve, reject) => {
                    //     sftpClient.delete(filePath)
                    //         .then(() => {
                    //             console.log(`Removed: ${filePath}`.cyan);
                    //             resolve();
                    //         })
                    //         .catch(reject)
                    // })
                });
                return promise
            })
    },
    onDestroy() {
        return sftpClient.end();
    }
}