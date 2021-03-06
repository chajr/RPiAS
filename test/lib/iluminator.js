let Config = require('../../lib/config');
let Iluminator = require('../../lib/iluminator');
let assert = require('assert');

describe('Test Illuminate Library', function(){
    describe('Test special day', function(){
        it('should return that current day is special day', function(){
            let Ilum = createIlluminatorObject(0, 0, {}, 0);
            let isSpecial = Ilum.isSpecialDay(new Date(2017, 4, 3));

            assert.equal(isSpecial, true);
        });

        it('should return that current day is normal day', function(){
            let Ilum = createIlluminatorObject(0, 0, {}, 0);
            let isSpecial = Ilum.isSpecialDay(new Date(2017, 5, 12));

            assert.equal(false, isSpecial);
        });

        it('should return that current day is weekend', function(){
            let Ilum = createIlluminatorObject(0, 0, {}, 0);
            let isSpecial = Ilum.isSpecialDay(new Date(2017, 5, 11));

            assert.equal(true, isSpecial);
        });
    });

    describe('Test on/off calculation', function(){
        it('prevent from double turn on', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 16, 0, 0));
            let Ilum = createIlluminatorObject(true, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 17, 31, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                false
            );
        });

        it('turn on because of minimal time', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 16, 0, 0));
            let Ilum = createIlluminatorObject(0, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 17, 30, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                true
            );

            assert.equal(Ilum.turnLightOn(), true);
            assert.equal(Ilum.turnLightOff(), false);
        });

        it('turn on because of sunset time', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 18, 0, 0));
            let Ilum = createIlluminatorObject(0, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 18, 30, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                true
            );

            assert.equal(Ilum.turnLightOn(), true);
            assert.equal(Ilum.turnLightOff(), false);
        });

        it('turn on because of maximal time', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 19, 30, 0));
            let Ilum = createIlluminatorObject(0, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 19, 0, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                true
            );

            assert.equal(Ilum.turnLightOn(), true);
            assert.equal(Ilum.turnLightOff(), false);
        });

        it('turn on because of below minimal time & special day', function(){
            let sunset = new SunCalcMock(new Date(2017, 4, 3, 16, 30, 0));
            let Ilum = createIlluminatorObject(0, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 4, 3, 16, 50, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                true
            );

            assert.equal(Ilum.turnLightOn(), true);
            assert.equal(Ilum.turnLightOff(), false);
        });

        it('bellow minimal time & not special day & not on', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 16, 30, 0));
            let Ilum = createIlluminatorObject(0, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 16, 50, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                false
            );

            assert.equal(Ilum.turnLightOn(), false);
            assert.equal(Ilum.turnLightOff(), false);
        });

        it('turn off because of bellow minimal time & not special day', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 16, 30, 0));
            let Ilum = createIlluminatorObject(true, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 16, 50, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                true
            );

            assert.equal(Ilum.turnLightOn(), false);
            assert.equal(Ilum.turnLightOff(), true);
        });

        it('turn off because of after max time', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 16, 30, 0));
            let Ilum = createIlluminatorObject(true, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 22, 11, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                true
            );

            assert.equal(Ilum.turnLightOn(), false);
            assert.equal(Ilum.turnLightOff(), true);
        });

        it('turn off because of time before sunset & after minimal', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 17, 50, 0));
            let Ilum = createIlluminatorObject(true, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 17, 31, 0));

            assert.equal(
                xor(Ilum.turnLightOn(), Ilum.turnLightOff()),
                true
            );

            assert.equal(Ilum.turnLightOn(), false);
            assert.equal(Ilum.turnLightOff(), true);
        });

        it('turn off because of force', function(){
            let sunset = new SunCalcMock(new Date(2017, 5, 13, 16, 30, 0));
            let Ilum = createIlluminatorObject(1, 0, {sunset: sunset}, 0);
            Ilum.calculate(new Date(2017, 5, 13, 17, 31, 0));

            assert.equal(Ilum.turnLightOn(), true);
            assert.equal(Ilum.turnLightOff(), true);
        });
    });
});

function xor (a, b) {
    return ( a || b ) && !( a && b );
}

/**
 * @param launched boolean
 * @param forceOn boolean
 * @param sunCalc Object
 * @param keepAlive boolean
 * @returns Iluminator
 */
function createIlluminatorObject(launched, forceOn, sunCalc, keepAlive) {
    return new Iluminator(
        new Config('../etc/config_test.json'), launched, forceOn, sunCalc, keepAlive
    );
}

class SunCalcMock {
    constructor (date) {
        /** @var Date **/
        this.date = date;
    }
    getTime() {
        return this.date.getTime();
    }
    getHours() {
        return this.date.getHours();
    }
    getMinutes() {
        return this.date.getMinutes();
    }
    getSeconds() {
        return this.date.getSeconds();
    }
    getDate() {
        return this.date.getDate();
    }
    getMonth() {
        return this.date.getMonth();
    }
    getFullYear() {
        return this.date.getFullYear();
    }
}
