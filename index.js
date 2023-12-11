require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgPool = require('./database_tools/connection');
const groupRoutes = require('./routes/groupRoutes'); 
const memberRoutes = require('./routes/memberRoutes'); 
const userRoutes =require('./routes/user');
const apiRoutes = require('./routes/apiRoute');
const reviewRoutes = require('./routes/review');
const app = express();
const port = process.env.PORT || 3001;

/*const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};*/

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/groups', groupRoutes); //Groups route
app.use('/members', memberRoutes); //members route
app.use('/review', reviewRoutes); //reviews route
app.use('/user', userRoutes); //User route
app.use('/api', apiRoutes); //Api route


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
//module.exports = app.listen(port);