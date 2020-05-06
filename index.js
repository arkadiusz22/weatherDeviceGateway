import DataHelper from './src/dataHelper';
import express from 'express';

const PORT = process.env.PORT || 5000
let data = [];

const app = express();
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('view.ejs', { data }));
app.get('/data', (req, res) => res.send(data));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const delay = 30 * 60 * 1000;
(async function fetchData() {
    data = await DataHelper.getData();
    setTimeout(fetchData, delay);
})();
