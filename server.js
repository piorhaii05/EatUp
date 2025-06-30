const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const COMMON = require('./COMMON');
const apiMobile = require('./api');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiMobile); // <-- chỉ gắn router

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});

app.use('/uploads', express.static('uploads'));