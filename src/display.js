var lcd = require('../lib/lcd');
var Gpio = require('onoff').Gpio;

var lcdLightStatus = 0;
var buttonLight;
var config;

/**
 * @todo show working time
 * @todo show last record status and time
 * @todo disk usage
 */

exports.launch = function (args, appConfig) {
    config = appConfig;

    init();

    buttonLight.watch(lcdLight);
};

function init() {
    buttonLight = new Gpio(
        config.get('alert_gpio.button_display'),
        'in',
        'both'
    );
}

function lcdLight(err, state) {
    if(state == 1) {
        if (lcdLightStatus) {
            lcd.lightOff();
            lcdLightStatus = 0;
        } else {
            lcd.lightOn();
            lcdLightStatus = 1;
        }
    }
}
