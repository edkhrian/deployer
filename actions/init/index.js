const path = require('path');
const fs = require('fs');
const writePackage = require('write-pkg');

const rootPath = process.cwd();

module.exports = async function() {
    // copy config files
    await copyFile('deploy.config.js');

    await copyFile('deploy.credentials.js');

    // edit .gitignore
    let ignoreStr = '# @edunse/deployer\n\ndeploy.credentials.js';
    const targetGitIgnorePath = path.join(rootPath, '.gitignore');
    if (fs.existsSync(targetGitIgnorePath)) {
        let oldGitIgnoreStr = fs.readFileSync(targetGitIgnorePath, 'utf-8');
        if (!/deploy\.credentials\.js/.test(oldGitIgnoreStr)) {
            ignoreStr = oldGitIgnoreStr + '\n\n' + ignoreStr;
        }
    }
    fs.writeFileSync(targetGitIgnorePath, ignoreStr, 'utf-8');

    // update package.json deploy script
    const targetPackagePath = path.join(rootPath, 'package.json');
    if (!fs.existsSync(targetPackagePath)) return;

    const targetPackage = require(targetPackagePath);
    if (targetPackage.scripts['deploy']) return;
    targetPackage.scripts['deploy'] = 'deployer deploy';

    return writePackage(targetPackagePath, targetPackage);
};

function copyFile(fileName) {
    const src = path.join(__dirname, fileName);
    const target =  path.join(rootPath, fileName);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(target)) {
            fs.copyFile(src, target, (err) => {
                if (err) return reject(err);
                resolve();
            });
        } else {
            resolve();
        }
    });
}