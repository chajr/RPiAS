var exec = require('sync-exec');
var log = require('../lib/log');
var worker = require('../lib/worker');
var request = require('request');
var led = require('../lib/led');
var uptime = require('../lib/uptime');

var name = 'System worker';
var config;
var buttonOff;
var Gpio;
var startTime;

exports.launch = function (args, appConfig, appStartTime) {
    config = appConfig;
    startTime = appStartTime;

    if (config.get('app.gpio_enabled')) {
        Gpio = require('onoff').Gpio;
    }

    init();
};

function init() {
    worker.startWorker(
        collectData,
        config.get('workers.system.worker_time'),
        name
    );

    if (config.get('app.gpio_enabled')) {
        buttonOff = new Gpio(
            config.get('alert_gpio.button_off'),
            'in',
            'both'
        );

        led.off(config.get('app.led_red'));
        led.on(config.get('app.led_green'));
        buttonOff.watch(systemOff);
    }
}

function systemOff(err, state) {
    if (state == 1) {
        var lcd = require('../lib/lcd');
        var uptime = uptime(startTime);
        var exec = require('child_process').exec;

        lcd.clear();
        lcd.displayMessage([
            'System shutdown',
            'after: ' + uptime
        ]);

        log.logInfo('System shutdown after: ' + uptime);
        console.log('System is shutting down.');

        exec(config.get('app.shutdown_command'));
    }
}

function collectData() {
    var data = [];
    var commands = config.get('commands');

    for (var key in commands) {
        data[key] = exec(commands[key]).stdout;
    }

    var url = config.get('workers.system.data_collector')
        + '?key='
        + config.get('workers.system.security_key');

    request.post(
        url,
        {form: data},
        function (error, response, body) {
            if (error) {
                log.logError(error);
            } else {
                log.logInfo(body);
            }
        }
    );
}
