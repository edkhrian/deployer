const path = require('path');
const fs = require('fs');
const writePackage = require('write-pkg');

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
    });
}

module.exports = function(rootPath) {
    const srcConfigPath = path.join(__dirname, './example.deploy.config.js');
    const targetConfigPath =  path.join(rootPath, 'deploy.config.js');

    // copy config file
    return copyFileIfNotExists(srcConfigPath, targetConfigPath)
        // edit .gitignore
        .then(() => {
            const ignoreStr = '# @edunse/deployer\n\ndeploy.config.js';
            const targetGitIgnorePath = path.join(rootPath, '.gitignore');
            if (fs.existsSync(targetGitIgnorePath)) {
                let data = fs.readFileSync(targetGitIgnorePath, 'utf-8');
                if (!/deploy\.config\.js/.test(data)) {
                    data += '\n\n' + ignoreStr;
                    fs.writeFileSync(targetGitIgnorePath, data, 'utf-8');
                }
            } else {
                fs.writeFileSync(targetGitIgnorePath, ignoreStr, 'utf-8');
            }
        })
        // update package.json deploy script
        .then(() => {
            const targetPackagePath = path.join(rootPath, 'package.json');
            if (!fs.existsSync(targetPackagePath)) return;

            const targetPackage = require(targetPackagePath);
            if (targetPackage.scripts['deploy']) return;
            targetPackage.scripts['deploy'] = 'deployer deploy';

            return writePackage(targetPackagePath, targetPackage);
        })
};