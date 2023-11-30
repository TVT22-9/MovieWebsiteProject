const { expect } = require('chai');
const request = require('supertest');
const app = require('../index.js');

describe('User tests', function () {
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
    it('Registers a new user', async function()  {
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
    
      it('Handles registration error: no password', async function ()  {
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
        } catch (error){
            console.error(error);
            throw error;
        }
      });
      it('Handles registration error: no username', async function ()  {
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
        } catch (error){
            console.error(error);
            throw error;
        }
      });
         
      it('Deletes an existing user', async function () {
        try{
            let username = 'usertestuser'
           await request(app)
            .delete('/user/?username=' + username)
            .expect(200);
        } catch (error){
            console.error(error);
            throw error;
        }
      });
      
        
      
       
  

});