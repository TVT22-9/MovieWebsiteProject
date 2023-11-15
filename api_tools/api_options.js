require('dotenv').config();

const apiOptions = {
    apiMethod: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + process.env.TMBD_API_RAT
      }
  };
  module.exports = apiOptions;