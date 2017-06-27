'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;

var assert = require('assert');
var should = require('should');

describe('Dates', function () {
    var Helpers = require('../js/helpers');

    it('should extract extractDayFromDate correctly', function (done) {
        const date = '2017-06-01 10:00:00';
        var extractDayFromDate = Helpers.extractDayFromDate(date);

        expect(extractDayFromDate).to.eql('01');

        done();
    });

    it('should extract extractTimeFromDate correctly', function (done) {
        const date = '2017-06-01 10:00:00';
        var extractTimeFromDate = Helpers.extractTimeFromDate(date);

        expect(extractTimeFromDate).to.eql('10:00:00');

        done();
    });

    it('should extract dayOfWeekAsString correctly', function (done) {
        const date = '2017-06-01 10:00:00';
        var dayOfWeekAsString = Helpers.dayOfWeekAsString(date);

        expect(dayOfWeekAsString).to.eql('Thursday');

        done();
    });
});

describe('JSON parsing', function () {
    var Helpers = require('../js/helpers');

    it('should extract getFullCityWeatherPerDay correctly', function (done) {
        const DATA_FROM_GETCITYWEATHER = require('../test/res/input/fullWeather5Days.json');
        const EXPECTED_JSON = require('../test/res/output/getFullCityWeatherPerDay.json');

        var getFullCityWeatherPerDay = Helpers.getFullCityWeatherPerDay(DATA_FROM_GETCITYWEATHER);

        expect(getFullCityWeatherPerDay).to.eql(EXPECTED_JSON);

        done();
    });

    it('should extract getCityWeatherPerDay correctly', function (done) {
        const DATA_FROM_GETCITYWEATHERPERDAY = require('../test/res/input/getCityWeatherPerDay.json');
        const EXPECTED_JSON = require('../test/res/output/getCityWeatherPerDay.json');

        var getCityWeatherPerDay = Helpers.getCityWeatherPerDay(DATA_FROM_GETCITYWEATHERPERDAY);

        expect(getCityWeatherPerDay).to.eql(EXPECTED_JSON);

        done();
    });
});

describe('Degrees conversions', function () {
    var Helpers = require('../js/helpers');

    it('should convert degrees C to F correctly', function (done) {
        const INPUT = 10;
        const EXPECTED_OUTPUT = 50;

        var getF = Helpers.convertDegreesCelToFar(INPUT);

        expect(getF).to.eql(EXPECTED_OUTPUT);

        done();
    });

    it('should convert degrees F to C correctly', function (done) {
        const INPUT = 50;
        const EXPECTED_OUTPUT = 10;

        var getC = Helpers.convertDegreesFarToCel(INPUT);

        expect(getC).to.eql(EXPECTED_OUTPUT);

        done();
    });
});
