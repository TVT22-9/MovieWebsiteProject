const {expect} = require('chai');
const request = require('supertest');
const app = require('../index.js');

describe('Review tests', function() {
    it('Get all reviews', async function() {
        try {
            const res = await request(app)
              .get('/review')
              .expect(200);

            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('idreview');
            expect(res.body[0]).to.have.property('iduser');
            expect(res.body[0]).to.have.property('idmovie');
            expect(res.body[0]).to.have.property('idseries');
            expect(res.body[0]).to.have.property('reviewcontent');
            expect(res.body[0]).to.have.property('score');
            
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
    );
});