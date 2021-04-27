const path = require('path');
const fs = require('fs');
const writePackage = require('write-pkg');

module.exports = function(rootPath) {
    copyFileIfNotExists(path.join(__dirname, '../deploy.config.js'), path.join(rootPath, 'deploy.config.js'))
        .then(() => {
            const ignoreStr = '# @edunse/deployer\n\ndeploy.config.js';
            const gitIgnorePath = path.join(rootPath, '.gitignore');
            if (fs.existsSync(gitIgnorePath)) {
                let data = fs.readFileSync(gitIgnorePath, 'utf-8');
                if (!/deploy\.config\.js/.test(data)) {
                    data += '\n\n' + ignoreStr;
                    fs.writeFileSync(gitIgnorePath, data, 'utf-8');
                }
            } else {
                fs.writeFileSync(gitIgnorePath, ignoreStr, 'utf-8');
            }
        })
        .then(() => {
            const targetPackagePath = path.join(rootPath, 'package.json');
            if (!fs.existsSync(targetPackagePath)) return;

            const targetPackage = require(targetPackagePath);
            if (targetPackage.scripts['deploy']) return;

            targetPackage.scripts['deploy'] = 'deployer deploy';

            return writePackage(path.join(rootPath, 'package.json'), targetPackage);
        })
        .then(() => {
            console.log('Init is completed');
        })
        .catch((e) => {
            console.error(e);
        })
};

function copyFileIfNotExists(fromPath, toPath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(toPath)) {
            fs.copyFile(fromPath, toPath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        } else {
            resolve();
        }
    })
}
