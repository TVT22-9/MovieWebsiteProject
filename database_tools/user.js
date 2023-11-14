const pgPool = require('./connection');
//sql object contain the relevant sql commands so they can be reused more effectively if the need arrives
const sql = {
    INSERT_USER: 'INSERT INTO  webusers (username,password,ownviewsettings) VALUES ($1, $2, $3)',
    GET_USERS: 'SELECT iduser,username,ownviewsettings FROM webusers',
    GET_USERBYNAME: 'SELECT iduser,username,ownviewsettings FROM webusers WHERE username=$1' ,
    GET_USERBYID: 'SELECT iduser,username,ownviewsettings FROM webusers WHERE iduser=$1' ,
    GET_PASSWORD: 'SELECT password FROM webusers WHERE username=$1'
};
//adduser function generates a new user into a database using the parameter given to it
//adduser function excludes the id becouse it is in serial mode so the database automatically creates it
async function addUser(username,password,ovsettings){
    await pgPool.query(sql.INSERT_USER, [username,password,ovsettings]);
}
//function that makes a data base query and returns all users
async function getAllUsers(){
    const result = await pgPool.query(sql.GET_USERS);
    const rows = result.rows;
    return rows;
}
//function that takes in a parameter username and then tries to make a database query based on that parameter, trying to get user data based on the username
async function getUserByName(username){
    const result = await pgPool.query(sql.GET_USERBYNAME,[username]);
    const rows = result.rows;
    return rows;
}
//function that takes in a parameter id and then tries to make a database query based on that parameter, trying to get user data based on the id
async function getUserByID(iduser){
    const result = await pgPool.query(sql.GET_USERBYID,[iduser]);
    const rows = result.rows;
    return rows;
}

async function checkUser(username){
    const result = await pgPool.query(sql.GET_PASSWORD, [username]);

    if(result.rows.length > 0){
        return result.rows[0].password;
    }else{
        return null;
    }
}

module.exports = {addUser, getAllUsers,getUserByName,getUserByID, checkUser};