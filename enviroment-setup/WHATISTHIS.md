You may wonder why this nodemon is in the outside folder not in the node_modules,
Because this package is been modified so that when a file is modified,
it run an ESLINT eveytime, instead of manually calling "npm run lint"

## THE FILE WAS MODIFIED:
enviroment-setup/nodemon/lib/monitor/watch.js
starting in line 218

 ```javascript
/*added*/ const cli = require("eslint/lib/cli");
/*added*/ const chalk = require('chalk');
/*added*/ const command = ['-c', '.eslintrc', 'src', '--ignore-pattern', 'src/public/**/*']

function restartBus(matched) {
  /*added*/ console.clear();
  /*added*/ console.log(chalk.yellow('[Eslint] Linting files...'));
  /*added*/ cli.execute(command).then((value) => {
  /*added*/   if(value == 0) {
      //utils.log.status('restarting due to changes...');
      matched.result.map(file => {
        utils.log.detail(path.relative(process.cwd(), file));
      });
      if (config.options.verbose) {
        utils.log._log('');
      }
      bus.emit('restart', matched.result);
    }
  });
}
```
