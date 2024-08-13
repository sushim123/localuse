const express = require ('express');
require('dotenv').config();
const authController = require('./controllers/authController');
const dataController = require('./controllers/dataController');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/auth', authController.showAuthLink);
app.get('/callback', authController.handleCallback);
app.get('/username', dataController.showUsernameForm);
app.post('/fetch-data', dataController.fetchData);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
