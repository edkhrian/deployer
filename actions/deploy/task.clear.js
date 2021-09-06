require('colors');
const path = require('path');
const Client = require('ssh2-sftp-client');
const sftpClient = new Client();

module.exports = {
    onInit(credentials) {
        return sftpClient
            .connect({
                host: credentials.host,
                port: '22',
                username: credentials.username,
                password: credentials.password
            })
    },
    onRun(taskData) {
        return sftpClient
            .list(taskData.dest)
            .then((files) => {
                const now = Date.now();
                return files
                    .filter(file => {
                        const isValidFileName = !taskData.fileTest || taskData.fileTest.test(file.name);
                        const isValidModifiedTime = !taskData.filesOlder || now - file.modifyTime > taskData.filesOlder;
                        return isValidFileName && isValidModifiedTime;
                    })
                    .map(file => path.join(taskData.dest, file.name));
            })
            .then(removeFiles => {
                if (removeFiles.length == 0) {
                    console.log('Nothing to remove'.green);
                    return;
                }
                const removePromises = removeFiles.map(filePath => {
                    return sftpClient.delete(filePath)
                        .then(() => {
                            console.log(`File has been removed: ${filePath}`.green);
                        })
                });
                return Promise.all(removePromises);
            })
    },
    onDestroy() {
        return sftpClient.end();
    }
}