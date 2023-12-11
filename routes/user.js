const express = require('express');
const bcrypt = require('bcrypt')
const pgPool = require('../database_tools/connection');
const router = express.Router();
const jwt = require('jsonwebtoken');

const {
    addUser,
    getAllUsers,
    getUserByID,
    getUserByName,
    checkUser,
    updateUserByName,
    deleteUser,
    updateUserSettings,
    getUserSettingByName
} = require('../database_tools/user');
const req = require('express/lib/request');

// Parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
//used to parse the json data that houses the users ownview settings
router.use(express.json());

//User post path that creates a new user if it is provided with body data containing settingsjson, username, password
//it also hashes the password before putting it into the database using bcrypt
//ovsettings is set to null if the inserted json data is formated wrong or things like that 
router.post('/register', async (req, res) => {
    const ovsettings = req.body.settingsjson ? JSON.parse(req.body.settingsjson) : null;
    const username = req.body.username;
    let password = req.body.password;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    password = await bcrypt.hash(password, 10);

    try {
        await addUser(username, password, ovsettings);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
//put path that updates the users name, password and settings if it's given a existing username
router.put('/', async (req, res) => {
    const newusername = req.body.newusername;
    let newpassword = req.body.newpassword;
    const newsettings = req.body.newsettings ? JSON.parse(req.body.newsettings) : null;
    const username = req.body.username;

    if (!newpassword) {
        return res.status(400).json({ error: 'newpassword is required' });
    }
    if (!newusername) {
        return res.status(400).json({ error: 'newusername is required' });
    }
    if (!newsettings) {
        return res.status(400).json({ error: 'newsettings is required' });
    }
    if (!username) {
        return res.status(400).json({ error: 'username is required' });
    }

    newpassword = await bcrypt.hash(newpassword, 10);

    try {
        const result = await updateUserByName(newusername, newpassword, newsettings, username);
        res.json(result[0]);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
});
//delete path that deletes a user if the given username exists
router.delete('/', async (req, res) => {
    const username = req.query.username;
    try {
        const result = await deleteUser(username);
        res.json(result[0]);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

});

//post path that works as the login, it takes into a body username and unhashed password, it then checks the password using the checkuser function that makes...
//a database query based on the username and returns the hashed password if the username is found in the database
//it then checks if the password matches the hashed password and if it's matched it provides jwttoken used in authentication process
router.post('/', async (req, res) => {
    const username = req.body.username;
    let password = req.body.password;

    const pwHash = await checkUser(username);

    if (pwHash) {
        const isCorrect = await bcrypt.compare(password, pwHash);
        if (isCorrect) {
            const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
            res.status(200).json({ jwtToken: token });
        } else {

            res.status(401).json({ error: 'Either username or password was wrong' });
        }
    } else {
        res.status(401).json({ error: 'Either username or password was wrong' });
    }
});
//user put path that updates users settings json table with new data if the corresponding username is inputed
//If the inputed json is wrong it null's it
router.put('/updatesettings', async (req, res) => {
    const username = req.body.username;
    const newsettings = req.body.username ? JSON.parse(req.body.newsettings) : null;


    if (!username) {
        return res.status(400).json({ error: 'username is required' });
    }


    try {
        const result = await updateUserSettings(newsettings, username);
        res.json(result[0]);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
});
//path that gets the user's settings if it is provided with existing username
router.get('/settings', async (req, res) => {
    const username = req.query.username;

    try {
        const userSettings = await getUserSettingByName(username);
        if (userSettings.length === 0) {
            res.status(404).json({ error: 'User not found ' });
        } else {
            res.json(userSettings);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/private', async (req, res) => {
    //Authorization: Bearer token
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const username = jwt.verify(token, process.env.JWT_SECRET).username;
        const userRows = await getUserByName(username);
        const userId = userRows[0].iduser;

        res.status(200).json({ private: username, userid: userId });
    } catch (error) {
        res.status(403).json({ error: 'Access forbidden' });
    }
});

//User get path that gets user data based on the parameter it gets 
//if it get either iduser or username it tries to find the corresponding users data from the database !hox it doesn't work with both at the same time
//if it gets neither it returns all users
router.get('/', async (req, res) => {
    try {
        if (req.query.iduser) {
            // If 'iduser' parameter is present in the query, fetch the user by ID
            const userId = req.query.iduser;
            const result = await getUserByID(userId);

            if (result.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.status(200).json(result[0]);
            }
        } else if (req.query.username) {
            // If 'username' parameter is present in the query, fetch the user by username
            const userName = req.query.username;
            const result = await getUserByName(userName);

            if (result.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.status(200).json(result[0]);
            }
        } else {
            // If neither 'iduser' nor 'username' parameters are present, fetch all users
            const result = await getAllUsers();
            res.status(200).json(result);
        }
    } catch (error) {
        console.error('Error querying the database', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;