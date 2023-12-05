const { expect } = require('chai');
const request = require('supertest');
const app = require('../index.js');

describe('Review tests', function () {
    it('Get all reviews', async function () {
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
    });
    
    it('Post a movie review', async function () {
        const review = {
            username: "testuser",
            idmovie: 1,
            idseries: null,
            reviewcontent: "This is a test review",
            score: 5
        }
        try {
            await request(app)
                .post('/review')
                .send(review)
                .expect(200);
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

    it('Get all reviews for a movie', async function () {
        const idmovie = 1;
        try {
            const res = await request(app)
                .get('/review/idmovie/' + idmovie)
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
    });

    it('Post a series review', async function () {
        const review = {
            username: "testuser",
            idmovie: null,
            idseries: 1,
            reviewcontent: "This is a test review",
            score: 5
        }
        try {
            await request(app)
                .post('/review')
                .send(review)
                .expect(200);
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

    it('Get all reviews for a series', async function () {
        const idseries = 1;
        try {
            const res = await request(app)
                .get('/review/idseries/' + idseries)
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
    });

    it('Post a review with missing fields. Expect an error', async function () {
        const review = {
            username: "testuser",
            idmovie: null,
            idseries: 2,
            reviewcontent: "This is a test review",
        }
            await request(app)
                .post('/review')
                .send(review)
                .expect(500);
    });

    it('Post a review with wrong type of fields. Expect an error', async function () {
        const review = {
            username: "testuser",
            idmovie: null,
            idseries: 2,
            reviewcontent: "This is a test review",
            score: "five"
        }
            await request(app)
                .post('/review')
                .send(review)
                .expect(500);
    });

    it('Post a review to an already reviewed movie. Expect an error', async function () {
        const review = {
            username: "testuser",
            idmovie: 1,
            idseries: null,
            reviewcontent: "This is a test review",
            score: 5
        }
            await request(app)
                .post('/review')
                .send(review)
                .expect(500);
    });

    it('Post a review to an already reviewed series. Expect an error', async function () {
        const review = {
            username: "testuser",
            idmovie: null,
            idseries: 1,
            reviewcontent: "This is a test review",
            score: 5
        }
            await request(app)
                .post('/review')
                .send(review)
                .expect(500);
    });

    it('Get all reviews made by a user', async function () {
        const username = "testuser";
        try {
            const res = await request(app)
                .get('/review/username/' + username)
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
    });

    it('Delete all reviews made by a user', async function () {
        const iduser = 51;
        try {
            const res = await request(app)
                .delete('/review/iduser/' + iduser)
                .expect(200);
        } catch (error) {
            console.error(error);
            throw error;
        }
    });
});