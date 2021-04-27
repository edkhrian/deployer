## Install
```bash
npm install --save-dev @edunse/deployer
```

## Usage

To create empty deploy.config.js, update package.json scripts and add deploy config to .gitignore:
```bash
deployer init
```

After that by running the script you can easily deploy files to a server according a config file:
```bash
deployer deploy
```
or
```bash
npm run deploy
```

### Dependencies
