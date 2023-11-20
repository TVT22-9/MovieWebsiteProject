const pgPool = require('./connection');
//sql object contain the relevant sql commands so they can be reused more effectively if the need arrives
const sql = {
    INSERT_USER: 'INSERT INTO  webusers (username,password,ownviewsettings) VALUES ($1, $2, $3)',
    GET_USERS: 'SELECT iduser,username,ownviewsettings FROM webusers',
    GET_USERBYNAME: 'SELECT iduser,username,ownviewsettings FROM webusers WHERE username=$1' ,
    GET_USERBYID: 'SELECT iduser,username,ownviewsettings FROM webusers WHERE iduser=$1' ,
    GET_PASSWORD: 'SELECT password FROM webusers WHERE username=$1',
    GET_USERSETTINGS: 'SELECT ownviewsettings FROM webusers WHERE username=$1',
    UPDATE_USERSETTINGS: 'UPDATE webusers SET ownviewsettings = $1 WHERE username=$2',
    DELETE_USER: 'DELETE FROM webusers WHERE username=$1',
    UPDATE_USER:'UPDATE webusers SET username=$1,password=$2,ownviewsettings=$3 WHERE username=$4'
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
//function that takes in a parameter username and checks if the corresponding username is in the database and returns its password so it can be checked in the route
async function checkUser(username){
    const result = await pgPool.query(sql.GET_PASSWORD, [username]);

    if(result.rows.length > 0){
        return result.rows[0].password;
    }else{
        return null;
    }
}
//function that takes in the parameter username and returns the corresponding user's settings if the username exists in the database
async function getUserSettingByName(username){
    const result = await pgPool.query(sql.GET_USERSETTINGS, [username]);
    const rows = result.rows;
    return rows;
}


//function that takes in the paremetes for new userdata and the old username and updates the corresponding data if the username exists
async function updateUserByName(newusername,newpassword,newsettings,username){
    try {
        const result = await pgPool.query(sql.UPDATE_USER, [newusername, newpassword, newsettings, username]);
        const rowCount = result.rowCount;
    
        if (rowCount === 0) {
          throw new Error('User not found');
        }
    
        return result.rows;
      } catch (error) {
        throw error;
      }
    }
//function that only updates the corresponding users settings if the given username exists
async function updateUserSettings(newsettings,username){
    try {
        const result = await pgPool.query(sql.UPDATE_USERSETTINGS, [newsettings, username]);
        const rowCount = result.rowCount;
        
        if (rowCount === 0) {
            throw new Error('User not found');
        }
        
            return result.rows;
        }   catch (error) {
            throw error;
        }
    }    
//funtion that deletes the user if it's given existing username    
async function deleteUser(username){
    
    try {
        const result = await pgPool.query(sql.DELETE_USER, [username]);
        const rowCount = result.rowCount;
    
        if (rowCount === 0) {
          throw new Error('User not found');
        }
    
        return result.rows;
      } catch (error) {
        throw error;
      }
   
}

module.exports = {addUser, getAllUsers,getUserByName,getUserByID, checkUser, getUserSettingByName, deleteUser, updateUserByName ,updateUserSettings};