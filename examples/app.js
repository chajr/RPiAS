var pigpio = require('pi-gpio');
var rpigpio = require('rpi-gpio');
var gpio = require('onoff').Gpio;

/*
var led = new gpio(26, 'out');
//var led = new gpio(13, 'out');
//led.writeSync(0);
led.writeSync(0);
*/

/*
var led = new gpio(26, 'out');
var button = new gpio(19, 'in', 'both');
button.watch(function(err, value) {
    if (value == 1) {
        console.log('button on');
    } else {
        console.log('button off');
    }
    led.writeSync(value);
});
*/




//rpigpio.setup(37, rpigpio.DIR_OUT, rpigpio.write(37, 1));

/*
rpigpio.setup(37, rpigpio.DIR_OUT, write);
 
function write() {
    rpigpio.write(37, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}
*/
/*
rpigpio.setup(35, rpigpio.DIR_IN, readInput);
 
function readInput() {
    rpigpio.read(35, function(err, value) {
        console.log('The value is ' + value);
    });
}
*/


/*
var status = 0;

setTimeout(function() {
     
    rpigpio.setup(37, rpigpio.DIR_OUT, write);
function write() {
    rpigpio.write(37, status, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    status = !status;
    });
}
}, 1000);
*/

/*
rpigpio.setup(35, rpigpio.DIR_IN, rpigpio.EDGE_BOTH);
while (true) {
    rpigpio.read(35, function (err, value) {
        if (err) {
            console.log(err);
        } else {
            console.log(value);
        }
    });
}
*/
/*
rpigpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});
*/



/*
pigpio.open(37, "output", function(err) {
    if (err) {
        console.log(err);
    }
        pigpio.write(37, 1, function(err){
        if (err) {
            console.log(err);
        }
    });
});
*/
/*
pigpio.read(35, function(err, value) {
    if(err) throw err;
    console.log(value); // The current state of the pin 
});
*/

//pigpio.close(26);                     // Close pin 16 
