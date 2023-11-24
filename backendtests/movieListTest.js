const { expect } = require('chai');
const request = require('supertest');
const app = require('../index.js');

describe('Api connection tests', function() {
    it('Getting a movie by id as a test to show api connection works', async function() {
        const id = 100;
        try {
            const res = await request(app)
              .get('/api/movieId/'+ id)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('title');

        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Getting a movie by id that doest exist. Returns an error.', async function() {
        const id = 1;
        const res = await request(app)
            .get('/api/movieId/'+ id)
            .expect(500);
    });

    it('Trying to get page full of top rated movies', async function() {
        const page = 1;
        try {
            const res = await request(app)
              .get('/api/topRatedMovies/' + page)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
});