const SSH2Promise = require('ssh2-promise');

module.exports = {
    onInit(config, data) {
        this.ssh = new SSH2Promise({
            host: config.host,
            username: config.username,
            password: config.password
        })
        return Promise.resolve();
    },
    onRun(taskData) {
        if (!taskData.dest) throw new Error('No command folder');
        return this.ssh
            .exec(`cd ${taskData.src} && ${taskData.command}`)
            .then((data) => {
                console.log(data.trim());
            });
    },
    onDestroy() {
        return this.ssh.close()
    }
}