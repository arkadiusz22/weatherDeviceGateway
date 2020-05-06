import axios from 'axios';
import stationsJson from './stations.json';

class DataHelper {
    async getAllSensorsData() {
        const url = 'http://powietrze.katowice.eu/api/sensors?latestData=true';
        const res = await axios.get(url);
        const { data: allSensorsData } = res;
        return allSensorsData;
    }

    prepareStationsSensorsData(allSensorsData) {
        const filteredSensorsData = allSensorsData.filter(sensor => stationsJson.map(station => station.stationId).includes(sensor.station_id));

        let stationsData = [];
        stationsJson.forEach(station => {
            const sensorsData = filteredSensorsData.filter(sensor => sensor.station_id === station.stationId);
            stationsData.push({
                ...station,
                sensorsData,
            })
        });
        return stationsData;
    }

    filterUnusedFiledsFromSensorsData(notFilteredStationsSensorsData) {
        const filteredData = JSON.parse(JSON.stringify(notFilteredStationsSensorsData));
        filteredData.forEach(station => {
            station.sensorsData.forEach(sensor => {
                delete sensor.id
                delete sensor.param_id
                delete sensor.station_name
                delete sensor.station_id
            })
        })
        return filteredData;
    }

    convertToThingsboardFormat(filteredData) {
        const convertedData = JSON.parse(JSON.stringify(filteredData));
        convertedData.forEach(station => {
            station.parsedSensorsData = {
                ts: Date.parse(station.sensorsData[0].param_timestamp),
                values: {},
            };
            station.sensorsData.forEach(sensor => {
                switch (sensor.param_name) {
                    case 'temperatura':
                        sensor.param_name = 'temperature';
                        break;
                    case 'ciśnienie':
                        sensor.param_name = 'pressure';
                        break;
                    case 'wilgotność':
                        sensor.param_name = 'humidity';
                        break;
                    default:
                        break;
                };
                station.parsedSensorsData.values[sensor.param_name] = sensor.param_value;
            });
            delete station.sensorsData;
        });
        return convertedData;
    }

    async getData() {
        const allSensorsData = await this.getAllSensorsData();
        const notFilteredSensorsData = this.prepareStationsSensorsData(allSensorsData);
        const filteredData = this.filterUnusedFiledsFromSensorsData(notFilteredSensorsData);
        const convertedData = this.convertToThingsboardFormat(filteredData);
        return convertedData;
    }
}

export default DataHelper = new DataHelper();