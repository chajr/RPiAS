#!/usr/bin/env node

let Config = require('./lib/config');
let log = require('./lib/log.js');
let redis = require('./lib/redis.js');
let fs = require('fs');

let config = new Config;
let args = process.argv.slice(2);
let startTime = new Date().getTime();
let app;

if (fs.existsSync(__dirname + '/src/' + args[0] + '.js')) {
    app = require(__dirname + '/src/' + args[0]);
} else {
    console.log('nothing to run');
    process.exit(1);
}

args.splice(0, 1);

try {
    redis.connect();
    redis.setData('error_led', 'false');
    app.launch(args, config, startTime);
    // process.exit(0);
} catch (error) {
    console.log('Application error, more info in log file.');
    console.log(error);
    log.logError(error);

    redis.setData('error_led', 'true');

    process.exit(1);
}
