# Raspberry Pi Alarm System (RPiAS)
This _Node JS_ application allow to manage automatic alarm system based on _Raspberry Pi_
computer powered by _Ubuntu Mate OS_ with camera and move detector. Application
record movie and send it to external server after move detection and also has
possibility to inform user about that detection by e-mail or sms. Also application
can handle some other devices like LCD display, LEDs and switches for some status
information and temperature with pressure measurement.

## Features
- Move detection
- Record movies (depend of camera type)
- Send movies to external server
- Build in diagnose system
- Display and switches for quick diagnose without console
- Display system statuses
- Temperature measurement
- Pressure measurement

## List of devices and technologies
- Raspberry Pi B+
- Ubuntu Mate OS
- Node JS 4.2
- Move detector `HC-SR501`
- 160 degree Camera HD Night Vision H
- Camera IR LED modules
- LCD display 2x16
- Green LED
- Red LED
- 3x Tact switch
- Resistors (2.2 kOhm, 2x 100 Ohm, 2x 10 kOhm)

## Connection schema

## Application setup

### Set Redis with keys:

- **rpia_illuminate_status** - false
- **rpia_illuminate_force** - on/off/null
- **rpia_illuminate_light_1** - false
- **rpia_illuminate_light_2** - false
- **rpia_alert_armed** - false
- **rpia_sms_send** - false (life for 15 min)
- **rpia_error_led** - false

### Mongo DB setup:

- Create `rpias` database

### Process setup:

Set up correct paths in etc/config.json, correct security key, geographic position, server path

`/etc/init.d/rpi-mc.sh` content:

```
#! /bin/sh

service ntp stop
ntpd -gq
service ntp start

sudo forever start -d /path/app.js system >> /var/log/rpi-mc-system.log
sudo forever start -d /path/app.js autoIlluminateNg >> /var/log/rpi-mc-autoIlluminateNg.log
sudo forever start -d /path/app.js light >> /var/log/rpi-mc-light.log
sudo forever start -d /path/app.js display >> /var/log/rpi-a-display.log
sudo forever start -d /path/app.js led >> /var/log/rpi-error-led.log
sudo forever start -d /path/app.js commandConsummer >> /var/log/rpi-commandConsummer.log
sudo forever start -d /path/app.js executor >> /var/log/rpi-executor.log
sudo forever start -d /path/app.js alert >> /var/log/rpi-a-alert.log
sudo forever start -d /path/app.js lcd >> /var/log/rpi-a-lcd.log
sudo forever start -d /path/app.js logCompressor >> /var/log/rpi-logCompressor.log
sudo forever start -d /path/server.js >> /var/log/rpi-mc-server.log
```

sudo update-rc.d rpi-mc.sh start

rsync -vrpogthlq ~/RPiAS/var/img/*.jpg username@remote_host:destination_directory
rsync -vrpogthlq ~/RPiAS/var/log/*.log username@remote_host:destination_directory
