require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pgPool = require('./database_tools/connection');

const userRoutes =require('./routes/user');
const apiRoutes = require('./routes/apiRoute');
const reviewRoutes = require('./routes/review');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use('/review', reviewRoutes); //reviews route
app.use('/user', userRoutes); //route i made so i can test the basic database connection, will delete later -Huhroo
app.use('/api', apiRoutes); //Api route

app.get('/', (req, res) => {
    res.send('Hello World');
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});