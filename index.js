const express = require('express');
const cors = require('cors');
const pgPool = require('./database_tools/connection');
const DELETEMERoutes =require('./routes/DELETEME');
const groupRoutes = require('./routes/groupRoutes'); // TÄSSÄ

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // TÄSSÄ
app.use(express.urlencoded({ extended: true })); //Tässä

app.use('/TEST', DELETEMERoutes); //route i made so i can test the basic database connection, will delete later -Huhroo
app.use('/groups', groupRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});