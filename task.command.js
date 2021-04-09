const SSH2Promise = require('ssh2-promise');

let ssh;

module.exports = {
    onInit(project, data) {
        ssh = new SSH2Promise({
            host: project.host,
            username: project.username,
            password: project.password
        })
        return Promise.resolve();
    },
    onRun(taskData) {
        if (!taskData.commandFolder) throw new Error('No command folder');

        return ssh
            .exec(`cd ${taskData.commandFolder} && ${taskData.command}`)
            .then((data) => {
                console.log(data.trim());
            });
    },
    onDestroy() {
        return ssh.close()
    }
}