require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pgPool = require('./database_tools/connection');
const userRoutes =require('./routes/user');
const apiRoutes = require('./routes/apiRoute');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use('/user', userRoutes); //User route
app.use('/api', apiRoutes); //Api route

app.get('/', (req, res) => {
    res.send('Hello World');
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});