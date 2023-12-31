const { expect } = require('chai');
const request = require('supertest');
const app = require('../index.js');

//usertests
describe('User tests', function () {
  //attemps to get all users and checks that they have data in them
  it('Get all users', async function () {
    try {
      const res = await request(app)
        .get('/user')
        .expect(200);


      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('iduser');
      expect(res.body[0]).to.have.property('username');
      expect(res.body[0]).to.have.property('ownviewsettings');


    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //Test to see if the non-existing id gives a error as it should
  it('Try to get user by non-existing ID', async function () {
    try {
      const nonExistingUserId = '0000';
      const res = await request(app)
        .get(`/user?iduser=${nonExistingUserId}`)
        .expect(404);

      expect(res.body).to.have.property('error', 'User not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //test to register a new user that is used in these tests
  it('Registers a new user', async function () {
    const newUser = {
      settingsjson: '{"showreviews": true, "showmovies": true}',
      username: 'usertestuser',
      password: 'testpassword'
    };
    try {
      await request(app)
        .post('/user/register')
        .send(newUser)
        .expect(200);

    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //Test to see if the registration propely fails when it doesn't get a password
  it('Handles registration error: no password', async function () {
    const invalidUser = {
      username: 'usertestuser'
      // Missing password, causing an error during registration
    };
    try {
      const res = await request(app)
        .post('/user/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body).to.have.property('error');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //Test to see if the registration propely fails when it doesn't get a username
  it('Handles registration error: no username', async function () {
    const invalidUser = {
      password: 'usertestuser'
      // Missing username, causing an error during registration
    };
    try {
      const res = await request(app)
        .post('/user/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body).to.have.property('error');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //test to test the update user route
  it('Update user', async function () {
    const updatedUser = {
      newusername: 'usertestuser',
      newpassword: 'testpassword',
      newsettings: '{"showreviews": true, "showmovies": true}',
      username: 'usertestuser'
    };
    try {
      await request(app)
        .put('/user')
        .send(updatedUser)
        .expect(200);

    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //test to test if the route gives the apropiate error when it's missing one of the important parts
  it('Attemps to update user with missing parameter', async function () {
    const newUser = {
      newusername: 'usertestuser',
      newpassword: 'testpassword',
      newsettings: '{"showreviews": true, "showmovies": true}'

    };
    try {
      await request(app)
        .put('/user')
        .send(newUser)
        .expect(400);

    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  //test to test the update user settings route
  it('Update users settings', async function () {
    const updatedUser = {
      username: 'usertestuser',
      newsettings: '{"showreviews": true, "showmovies": false}'
    };
    try {
      await request(app)
        .put('/user/updatesettings')
        .send(updatedUser)
        .expect(200);

    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  //test to test if  the update user settings route gives error when missing a parameter
  it('Attemps to update users settings with missing parameter', async function () {
    const updatedUser = {
      newsettings: '{"showreviews": true, "showmovies": false}'
    };
    try {
      await request(app)
        .put('/user/updatesettings')
        .send(updatedUser)
        .expect(400);

    } catch (error) {
      console.error(error);
      throw error;
    }
  });
//test to test if the get user settings work
  it('Attempts to get user settings using usertestuser', async function () {
    const user = 'usertestuser'

    try {
      const res = await request(app)
        .get('/user/settings?username=' + user)

        .expect(200)

      expect(res.body[0]).to.have.property('ownviewsettings');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
 //Test to test if the login works
  it('Attempts to login using usertestuser', async function () {
    const user = {
      username: 'usertestuser',
      password: 'testpassword'
    };
    try {
      const res = await request(app)
        .post('/user')
        .send(user)
        .expect(200)

      expect(res.body).to.have.property('jwtToken');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //test to test if the login handles error, wrong password
  it('Attempts to login using usertestuser with wrong password', async function () {
    const user = {
      username: 'usertestuser',
      password: 'password test'
    };
    try {
      const res = await request(app)
        .post('/user')
        .send(user)
        .expect(401)

    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //test to test if the login handles error, non existan username
  it('Attempts to login using into non existant account', async function () {
    const user = {
      username: 'hulivilivilihuli',
      password: 'testpassword'
    };
    try {
      const res = await request(app)
        .post('/user')
        .send(user)
        .expect(401)

    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  //test to see if the delete user by name is working and also cleans the testuser out of the DB   
  it('Deletes an existing user', async function () {
    try {
      let username = 'usertestuser'
      await request(app)
        .delete('/user/?username=' + username)
        .expect(200);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  it('Tries to Delete an non-existing user', async function () {
    try {
      let username = 'Hulivilivilihuli'
      await request(app)
        .delete('/user/?username=' + username)
        .expect(404);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });







});