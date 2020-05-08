import axios from 'axios';
import tokens from './tokens.json';
import moment from 'moment-timezone';

class ThingsboardHelper {
    getDeviceToken(stationId) {
        const station = tokens.find(element => element.stationId === stationId);
        return station.deviceToken;
    }

    registerAllDevices(devicesData) {
        devicesData.forEach(deviceData => {
            this.registerDevice(deviceData);
        });
    }

    registerDevice(deviceData) {
        const { stationId, name, lat: lattitude, lon: longitude } = deviceData;
        const token = this.getDeviceToken(stationId);
        const url = `https://thingsboard.makowski.edu.pl/api/v1/${token}/attributes`;
        const body = { name, lattitude, longitude, };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        axios.post(url, body, config)
            .then(function (response) {
                console.log(`registerDevice for stationId ${stationId}.`)
            })
            .catch(function (error) {
                console.log(`error ${error.code} in registerDevice for stationId ${stationId}.`);
            });
    }

    sendDataToThingsboard(devicesData) {
        devicesData.forEach(deviceData => {
            this.sendDeviceData(deviceData);
        });
    }

    sendDeviceData(deviceData) {
        const { stationId, parsedSensorsData } = deviceData;
        const token = this.getDeviceToken(stationId);
        const url = `https://thingsboard.makowski.edu.pl/api/v1/${token}/telemetry`;
        const body = {
            ts: moment.tz(parsedSensorsData.ts, "Europe/Warsaw").format('x'),
            values: parsedSensorsData.values
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        axios.post(url, body, config)
            .then(function (response) {
                console.log(`sendDeviceData for stationId ${stationId}.`)
            })
            .catch(function (error) {
                console.log(`error ${error.code} in sendDeviceData for stationId ${stationId}.`);
            });
    }
}

export default ThingsboardHelper = new ThingsboardHelper();