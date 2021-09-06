const SSH2Promise = require('ssh2-promise');

module.exports = {
    onInit(credentials) {
        this.ssh = new SSH2Promise({
            host: credentials.host,
            username: credentials.username,
            password: credentials.password
        })
        return Promise.resolve();
    },
    onRun(taskData) {
        if (!taskData.command) throw new Error('No command');
        let execStr = taskData.src ? `cd ${taskData.src} && ` : '';
        execStr += taskData.command || '';
        return this.ssh
            .exec(execStr)
            .then((data) => {
                console.log(data.trim());
            });
    },
    onDestroy() {
        return this.ssh.close()
    }
}