const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('uploads/adhaarImage'));
app.use(express.static('uploads/panImage'));
app.use(express.static('uploads/bank_statements'));

const userRoutes = require('./routes/user');

app.use('/user', userRoutes);

app.listen(8081, () => {
    console.log("Server started on port 8081");
});
