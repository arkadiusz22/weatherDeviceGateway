import DataHelper from './src/dataHelper';
import ThingsboardHelper from './src/thingsboardHelper';
import express from 'express';

const PORT = process.env.PORT || 5000
let data = [];
let initialFetch = true;

const app = express();
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('view.ejs', { data }));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const delay = 20 * 60 * 1000;
(async function fetchData() {
    data = await DataHelper.getData();
    if (initialFetch) {
        ThingsboardHelper.registerAllDevices(data);
        initialFetch = false;
    }
    ThingsboardHelper.sendDataToThingsboard(data);
    setTimeout(fetchData, delay);
})();
